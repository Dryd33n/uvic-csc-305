import sys

import numpy as np
from raytracer_io import parse_scene, write_ppm, write_pixel
from raytracer_helpers import get_inverse_transform_matrix, \
    solve_unit_sphere_intersections, compute_phong_specular, compute_phong_diffuse
from raytracer_types import Ray, Vec3, Scene, Color, Sphere, HitResult, Light, CameraAxes
from raytracer_cli import progress, intro, progress_bar_setup, validate_args

CAMERA_POS = Vec3(0, 0, 0)
CAMERA_AXES = CameraAxes(
    right=Vec3(1, 0, 0),
    up=Vec3(0, 1, 0),
    forward=Vec3(0, 0, -1),
)
MAX_DEPTH = 3


def get_camera_ray_for_pixel(x: int, y: int, camera: CameraAxes, scene: Scene) -> Ray:
    width = scene.res.x
    height = scene.res.y

    ray_direction = Vec3(x=scene.right * (2.0 * x / width - 1.0),
                         y=scene.top * (2.0 * (height - y) / height - 1.0),
                         z=scene.near)

    direction = Vec3(
        x=camera.right.dot(ray_direction),
        y=camera.up.dot(ray_direction),
        z=camera.forward.dot(ray_direction),
    )
    return Ray(CAMERA_POS, direction)


def test_sphere_hit(ray: Ray, sphere: Sphere) -> list[float]:
    inverse_transform_matrix = get_inverse_transform_matrix(sphere.scale, sphere.pos)
    sphere_space_ray = ray.transform(inverse_transform_matrix)

    return solve_unit_sphere_intersections(sphere_space_ray)


def get_intersection_surface_normal(closest_sphere: Sphere, ray: Ray, t_closest: float) -> Vec3:
    inv_transform = get_inverse_transform_matrix(closest_sphere.scale, closest_sphere.pos)

    intersection_point = ray.origin + ray.direction * t_closest

    # Transform hit point into local sphere space
    local_normal = Vec3.from_homogeneous(inv_transform @ intersection_point.as_point())

    # Transform normal back to world space using inverse transpose
    world_normal = inv_transform.T @ local_normal.as_direction()
    return Vec3.from_homogeneous(world_normal)


def get_closest_hit(ray: Ray, spheres: list[Sphere], near: float) -> HitResult:
    closest_t: float = 1000000.0
    closest_sphere: Sphere | None = None

    # for every sphere in the scene
    for sphere in spheres:
        # determine if hit occurs and where
        hits = test_sphere_hit(ray, sphere)

        # if we have hits, test them and see which is closer and valid
        for hit in hits:
            if 0.000001 < hit < closest_t and (-ray.direction.z * hit > near or ray.depth != 1):
                closest_t = hit
                closest_sphere = sphere

    # returns None, None, None, None if no hit
    if closest_sphere is None:
        return HitResult()

    surface_normal = get_intersection_surface_normal(closest_sphere, ray, closest_t)
    side = "far" if ray.direction.dot(surface_normal) > 0 else "near"

    return HitResult(sphere=closest_sphere,
                     hit_distance=closest_t,
                     hit_point=ray.origin + ray.direction * closest_t,
                     normal=surface_normal,
                     side=side)


def is_occluded(shadow_hit_result: HitResult) -> bool:
    return shadow_hit_result.hit_distance < 1.0


def get_diffuse_lighting(result: HitResult, scene: Scene, light: Light) -> Color:
    # vector from light position to ray hit position
    light_ray_direction = light.pos - result.hit_point
    ray_to_light = Ray(origin=result.hit_point,
                       direction=light_ray_direction,
                       depth=2)

    # use get_closest_hit to determine if a sphere is blocking the ray from the original ray hit point to the light
    shadow_result = get_closest_hit(ray_to_light, scene.spheres, scene.near)

    # if light is blocked and sphere is between light and ray start it is occluded so return black
    if shadow_result.is_hit and is_occluded(shadow_result):
        return Color()

    normalized_surface_normal = result.normal.normalize()
    normalized_light_direction = light_ray_direction.normalize()

    if not result.is_near_side:
        normalized_surface_normal = -normalized_surface_normal

    diffuse = compute_phong_diffuse(surface_normal=normalized_surface_normal,
                                    light_direction=normalized_light_direction,
                                    diffuse_coefficient=result.sphere.diffuse_coefficient,
                                    light_intensity=light.intensity,
                                    object_color=result.sphere.color)

    specular = compute_phong_specular(surface_normal=normalized_surface_normal,
                                      light_ray_direction=light_ray_direction,
                                      hit_point=result.hit_point,
                                      shininess=result.sphere.shininess_exponent,
                                      specular_coefficient=result.sphere.specular_coefficient,
                                      light_intensity=light.intensity)

    return diffuse + specular


def compute_direct_lighting(result: HitResult, scene: Scene) -> Color:
    diffuse_lighting = Color()

    for light in scene.lights:
        diffuse_lighting += get_diffuse_lighting(result, scene, light)

    return diffuse_lighting


def compute_ambient_lighting(result: HitResult, scene: Scene) -> Color:
    return scene.ambient * result.sphere.color * result.sphere.ambient_coefficient


def compute_reflective_lighting(reflection_ray: Ray, result: HitResult, scene: Scene) -> Color:
    reflective_color = raytrace(reflection_ray, scene)
    return reflective_color * result.sphere.reflective_coefficient


def raytrace(ray: Ray, scene: Scene) -> Color:
    if ray.depth > MAX_DEPTH:
        return Color()

    # find nearest intersection along ray
    result = get_closest_hit(ray, scene.spheres, scene.near)

    # case were no spheres were hit
    if not result.is_hit:
        if ray.depth == 1:
            return scene.back
        else:
            return Color()

    diffuse_lighting = compute_direct_lighting(result=result,
                                               scene=scene)

    ambient_lighting = compute_ambient_lighting(result=result,
                                                scene=scene)

    reflection_lighting = compute_reflective_lighting(reflection_ray=Ray(
        origin=result.hit_point,
        direction=ray.direction.reflect(result.normal.normalize()),
        depth=ray.depth + 1,
    ),
        result=result,
        scene=scene)

    return ambient_lighting + diffuse_lighting + reflection_lighting


def main() -> None:
    # make sure argument / file input is valid
    input_file = validate_args()

    # print intro
    intro(input_file)

    # parse scene into scene object
    print(" •  (1/4) Parsing scene file...", end="")
    scene = parse_scene(input_file)
    print(" Done")

    # generate pixel array, every pixel is represented by 3 uint8 values (R, G, B)
    print(" •  (2/4) Generating Pixel Array...", end="")
    pixelArray = np.zeros(scene.res.x * scene.res.y * 3, dtype=np.uint8)
    print(" Done")

    # raytracing / rendering
    print(" •  (3/4) Raytracing...")
    progress_bar = progress_bar_setup(scene.res.x, scene.res.y)

    # for every row of pixels
    for x in range(scene.res.x):
        # for every pixel in the row
        for y in range(scene.res.y):
            ray = get_camera_ray_for_pixel(x, y, CAMERA_AXES, scene)
            pixelColor = raytrace(ray, scene)
            write_pixel(scene.res, x, y, pixelColor, pixelArray)

            # progress bar logic
            progress_bar.inc()
            if progress_bar.interval_reached():
                progress(progress_bar)

    # delete progress bar and update rendering line
    sys.stdout.write('\r' + ' ' * 80 + '\033[A\r •  (3/4) Raytracing... Done\n')
    sys.stdout.flush()

    # write output files
    print(" •  (4/4) Writing output files...", end="")
    output_dir = write_ppm(pixelArray, scene, "p3")
    print(" Done")

    # termination
    print(f"\nSuccess! Output files written to: {output_dir}\n\n")


if __name__ == "__main__":
    main()
