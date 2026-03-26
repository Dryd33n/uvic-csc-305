import os
import sys
from typing import Literal

import numpy as np
from raytracer_types import Vec3, IntVec2, Color, Light, Sphere, Scene


def file_exists(filepath: str) -> bool:
    return os.path.isfile(filepath)


def parse_scene(filename: str) -> Scene:
    parsed_scene = Scene()

    with open(filename, "r") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line:
                continue

            tokens = line.split()
            keyword = tokens[0].upper()

            if keyword == "NEAR":
                parsed_scene.near = float(tokens[1])

            elif keyword == "LEFT":
                parsed_scene.left = float(tokens[1])

            elif keyword == "RIGHT":
                parsed_scene.right = float(tokens[1])

            elif keyword == "BOTTOM":
                parsed_scene.bottom = float(tokens[1])

            elif keyword == "TOP":
                parsed_scene.top = float(tokens[1])

            elif keyword == "RES":
                parsed_scene.res = IntVec2(int(tokens[1]), int(tokens[2]))

            elif keyword == "SPHERE":
                # SPHERE <name> <px> <py> <pz> <sx> <sy> <sz> <r> <g> <b> <ka> <kd> <ks> <kr> <n>
                sphere = Sphere(
                    name=tokens[1],
                    pos=Vec3(float(tokens[2]), float(tokens[3]), float(tokens[4])),
                    scale=Vec3(float(tokens[5]), float(tokens[6]), float(tokens[7])),
                    color=Color(float(tokens[8]), float(tokens[9]), float(tokens[10])),
                    ambient_coefficient=float(tokens[11]),
                    diffuse_coefficient=float(tokens[12]),
                    specular_coefficient=float(tokens[13]),
                    reflective_coefficient=float(tokens[14]),
                    shininess_exponent=int(tokens[15]),
                )
                parsed_scene.spheres.append(sphere)

            elif keyword == "LIGHT":
                # LIGHT <name> <px> <py> <pz> <ir> <ig> <ib>
                light = Light(
                    name=tokens[1],
                    pos=Vec3(float(tokens[2]), float(tokens[3]), float(tokens[4])),
                    intensity=Color(float(tokens[5]), float(tokens[6]), float(tokens[7])),
                )
                parsed_scene.lights.append(light)

            elif keyword == "BACK":
                parsed_scene.back = Color(float(tokens[1]), float(tokens[2]), float(tokens[3]))

            elif keyword == "AMBIENT":
                parsed_scene.ambient = Color(float(tokens[1]), float(tokens[2]), float(tokens[3]))

            elif keyword == "OUTPUT":
                parsed_scene.output = tokens[1]

    return parsed_scene


def write_pixel(resolution: IntVec2, x: int, y: int, color: Color, pixel_array: np.ndarray) -> None:
    """Write a color into the flat pixel array at position (x, y).

    :param IntVec2 resolution: Image resolution (width, height).
    :param int x: Horizontal pixel coordinate (0 = left).
    :param int y: Vertical pixel coordinate (0 = top).
    :param Color color: Color to write, channel values in [0, 1].
    :param np.ndarray pixel_array: Flat RGB byte array of length ``3 * width * height``.
    :rtype: None
    """
    index = 3 * (resolution.x * y + x)
    pixel_array[index:index + 3] = color.to_rgb255()


def write_ppm(image: np.ndarray, scene: Scene, ppm_format: Literal["p3", "p6"]) -> str:
    width = scene.res.x
    height = scene.res.y

    if ppm_format == "p6":
        with open(scene.output, 'wb') as f:
            f.write(bytearray(scene.ppm_header_p6(), 'ascii'))
            image.tofile(f)
    else:
        with open(scene.output, 'w') as f:
            f.write(scene.ppm_header_p3())
            for r in range(height):
                row_pixels = []
                for c in range(width):
                    index = 3 * (r * width + c)
                    row_pixels.append(f"{image[index]} {image[index + 1]} {image[index + 2]}")
                f.write(" ".join(row_pixels) + "\n")

    return os.path.abspath(os.path.dirname(scene.output) or '.')


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python raytracer_io.py <scene_file>")
        sys.exit(1)

    scene = parse_scene(sys.argv[1])
    print(scene)
