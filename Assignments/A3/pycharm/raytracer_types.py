from collections.abc import Iterator
from dataclasses import dataclass, field

import numpy as np


@dataclass
class Vec3:
    x: float
    y: float
    z: float

    def __mul__(self, other: float | int) -> 'Vec3':
        return Vec3(self.x * other, self.y * other, self.z * other)

    def __rmul__(self, other: float | int) -> 'Vec3':
        return self.__mul__(other)

    def __add__(self, other: 'Vec3') -> 'Vec3':
        return Vec3(self.x + other.x, self.y + other.y, self.z + other.z)

    def __sub__(self, other: 'Vec3') -> 'Vec3':
        return Vec3(self.x - other.x, self.y - other.y, self.z - other.z)

    def __neg__(self) -> 'Vec3':
        return Vec3(-self.x, -self.y, -self.z)

    def __iter__(self) -> Iterator[float]:
        yield self.x
        yield self.y
        yield self.z

    def __array__(self, dtype: type | None = None, copy: bool | None = None) -> np.ndarray:
        return np.array([self.x, self.y, self.z], dtype=dtype)

    def to_array(self) -> np.ndarray:
        return np.array([self.x, self.y, self.z])

    def as_point(self) -> np.ndarray:
        return np.array([self.x, self.y, self.z, 1.0])

    def as_direction(self) -> np.ndarray:
        return np.array([self.x, self.y, self.z, 0.0])

    @staticmethod
    def from_homogeneous(v: np.ndarray) -> 'Vec3':
        return Vec3(v[0], v[1], v[2])

    def normalize(self) -> 'Vec3':
        mag = (self.x ** 2 + self.y ** 2 + self.z ** 2) ** 0.5
        return Vec3(self.x / mag, self.y / mag, self.z / mag)

    def dot(self, other: 'Vec3') -> float:
        return self.x * other.x + self.y * other.y + self.z * other.z

    def reflect(self, normal: 'Vec3') -> 'Vec3':
        return self - normal * (2 * self.dot(normal))


@dataclass
class IntVec2:
    x: int
    y: int


@dataclass
class Color:
    r: float = 0.0
    g: float = 0.0
    b: float = 0.0

    def __add__(self, other: 'Color') -> 'Color':
        return Color(self.r + other.r, self.g + other.g, self.b + other.b)

    def __iter__(self) -> Iterator[float]:
        yield self.r
        yield self.g
        yield self.b

    def __array__(self, dtype: type | None = None, copy: bool | None = None) -> np.ndarray:
        return np.array([self.r, self.g, self.b], dtype=dtype)

    def to_array(self) -> np.ndarray:
        return np.array([self.r, self.g, self.b])

    def __mul__(self, other: 'float | int | Color') -> 'Color':
        if isinstance(other, Color):
            return Color(self.r * other.r, self.g * other.g, self.b * other.b)
        return Color(self.r * other, self.g * other, self.b * other)

    __rmul__ = __mul__

    def to_rgb255(self) -> 'Color':
        return Color(r=int(max(0.0, min(1.0, self.r)) * 255),
                     g=int(max(0.0, min(1.0, self.g)) * 255),
                     b=int(max(0.0, min(1.0, self.b)) * 255))


@dataclass
class Sphere:
    name: str
    pos: Vec3
    scale: Vec3
    color: Color
    ambient_coefficient: float
    diffuse_coefficient: float
    specular_coefficient: float
    reflective_coefficient: float
    shininess_exponent: int


@dataclass
class Light:
    name: str
    pos: Vec3
    intensity: Color


@dataclass
class Ray:
    origin: Vec3
    direction: Vec3
    depth: int = 1

    def transform(self, matrix: np.ndarray) -> 'Ray':
        origin = Vec3(*(matrix @ self.origin.as_point())[:3])
        direction = Vec3(*(matrix @ self.direction.as_direction())[:3])
        return Ray(origin, direction, self.depth)


@dataclass
class ProgressBar:
    total: int
    update_interval: int
    progress: int = 0

    def inc(self) -> None:
        self.progress += 1

    def interval_reached(self) -> bool:
        return self.progress % self.update_interval == 0


@dataclass
class CameraAxes:
    right: Vec3
    up: Vec3
    forward: Vec3


@dataclass
class HitResult:
    sphere: 'Sphere | None' = None
    hit_distance: float | None = None
    hit_point: 'Vec3 | None' = None
    normal: 'Vec3 | None' = None
    side: str | None = None

    @property
    def is_hit(self) -> bool:
        return self.sphere is not None

    @property
    def is_near_side(self) -> bool:
        return self.side == "near"


@dataclass
class Scene:
    near: float = 0.0
    left: float = 0.0
    right: float = 0.0
    bottom: float = 0.0
    top: float = 0.0
    res: IntVec2 = field(default_factory=lambda: IntVec2(0, 0))
    spheres: list['Sphere'] = field(default_factory=list)
    lights: list['Light'] = field(default_factory=list)
    back: Color = field(default_factory=lambda: Color(0.0, 0.0, 0.0))
    ambient: Color = field(default_factory=lambda: Color(0.0, 0.0, 0.0))
    output: str = ""

    def ppm_header_p3(self) -> str:
        return f"P3\n{self.res.x} {self.res.y}\n255\n"

    def ppm_header_p6(self) -> str:
        return f"P6\n{self.res.x} {self.res.y}\n255\n"


    def __repr__(self) -> str:
        lines = [
            f"NEAR:    {self.near}",
            f"LEFT:    {self.left}",
            f"RIGHT:   {self.right}",
            f"BOTTOM:  {self.bottom}",
            f"TOP:     {self.top}",
            f"RES:     {self.res.x} x {self.res.y}",
            "",
        ]
        for sphere in self.spheres:
            lines.append(f"SPHERE   {sphere.name}  pos=({sphere.pos.x}, {sphere.pos.y}, {sphere.pos.z})  "
                         f"scl=({sphere.scale.x}, {sphere.scale.y}, {sphere.scale.z})  "
                         f"color=({sphere.color.r}, {sphere.color.g}, {sphere.color.b})  "
                         f"ka={sphere.ambient_coefficient}  kd={sphere.diffuse_coefficient}  ks={sphere.specular_coefficient}  kr={sphere.reflective_coefficient}  n={sphere.shininess_exponent}")
        lines.append("")
        for light in self.lights:
            lines.append(f"LIGHT    {light.name}  pos=({light.pos.x}, {light.pos.y}, {light.pos.z})  "
                         f"intensity=({light.intensity.r}, {light.intensity.g}, {light.intensity.b})")
        lines += [
            "",
            f"BACK:    ({self.back.r}, {self.back.g}, {self.back.b})",
            f"AMBIENT: ({self.ambient.r}, {self.ambient.g}, {self.ambient.b})",
            f"OUTPUT:  {self.output}",
        ]
        return "\n".join(lines)

