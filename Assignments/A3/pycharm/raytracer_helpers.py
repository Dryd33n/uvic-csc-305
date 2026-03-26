from raytracer_types import Color, Vec3, Ray
import numpy as np



def get_inverse_transform_matrix(scale: Vec3, position: Vec3) -> np.ndarray:
    """Returns a 4x4 matrix that is the inverse of a given scaling and translation operation

    :param Vec3 scale: scaling vector to be inverted
    :param Vec3 position: translation vector to be inverted
    :rtype: 4X4 Matrix np.array
    """
    return np.array([[1 / scale.x, 0          , 0          , -position.x / scale.x],
                     [0          , 1 / scale.y, 0          , -position.y / scale.y],
                     [0          , 0          , 1 / scale.z, -position.z / scale.z],
                     [0          , 0          , 0          , 1]])



def solve_unit_sphere_intersections(ray: Ray) -> list[float]:
    """Solve for intersection of a ray through a unit sphere

    Solves the quadratic equation formed from:
    || ray.origin + t * ray.direction ||^2 = 1

    :param Ray ray: ray transformed into unit sphere space
    :rtype: none or 2 floats representing where the ray intersected the sphere
    """
    a = ray.direction.dot(ray.direction)
    b = ray.direction.dot(ray.origin)
    c = ray.origin.dot(ray.origin) - 1

    discriminant = b * b - a * c

    if discriminant < 0:
        return []

    discriminant_sqrt = np.sqrt(discriminant)
    t1 = (-b + discriminant_sqrt) / a
    t2 = (-b - discriminant_sqrt) / a
    return [t1, t2]


def compute_phong_diffuse(surface_normal: Vec3, light_direction: Vec3, diffuse_coefficient: float,
                          light_intensity: Color, object_color: Color) -> Color:
    """Compute the Phong diffuse lighting for a light using the following equation:

    Id = Ip * Kd * Od * (N dot L)

    :param Vec3 surface_normal: Unit surface normal at the hit point.
    :param Vec3 light_direction: Unit direction from hit point toward the light.
    :param float diffuse_coefficient: Kd diffuse reflectance coefficient.
    :param Color light_intensity: Ip intensity of the light source.
    :param Color object_color: Od diffuse color of the object.
    :rtype: Color
    """
    diffuse_intensity = max(0.0, surface_normal.dot(light_direction))
    return light_intensity * diffuse_intensity * object_color * diffuse_coefficient


def compute_phong_specular(surface_normal: Vec3, light_ray_direction: Vec3, hit_point: Vec3, shininess: int,
                           specular_coefficient: float, light_intensity: Color) -> Color:
    """Compute the Phong specular component for a light using the following equation:

    Is = Ip * Ks * (N dot H)^n

    :param Vec3 surface_normal: normalized surface normal at the hit point. (N)
    :param Vec3 light_ray_direction: normalized direction from hit point toward the light.
    :param Vec3 hit_point: Hit point in camera space
    :param int shininess:  Shininess exponent (n).
    :param float specular_coefficient: Specular coefficient (Ks).
    :param Color light_intensity: light intensity (Ip).
    :rtype: Color
    """
    view_dir = (-hit_point).normalize()
    norm_reflection = (-light_ray_direction).reflect(surface_normal).normalize()
    spec_intensity = max(0.0, norm_reflection.dot(view_dir)) ** shininess
    return light_intensity * spec_intensity * specular_coefficient


