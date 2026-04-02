# <img src="https://github.com/Dryd33n/Dryd33n/blob/main/logos/uvic.png" height="25"> CSC 305: Introduction to Computer Graphics
WebGL and Python assignments from UVic CSC 305, covering topics such as:
- **3D Scene Construction**: Building and rendering interactive 3D scenes using WebGL and JavaScript.
- **Hierarchical Modeling**: Structuring scenes with parent-child transform hierarchies for articulated objects.
- **Lighting Models**: Implementing Phong and Blinn-Phong shading models with ambient, diffuse, and specular components.
- **Shader Programming**: Writing vertex and fragment shaders in GLSL for per-fragment lighting and novel visual effects.
- **Texture Mapping**: Applying and mapping file-based and procedural textures to 3D geometry.
- **Camera Control**: Implementing lookAt-based camera systems including 360-degree fly-around animations.
- **Ray Tracing**: Building a physically-based ray tracer from scratch supporting reflections, shadows, and Phong illumination.
- **Ray-Sphere Intersection**: Computing intersections in transformed object space using inverse transform matrices.
- **Matrix Transformations**: Applying model, view, and projection matrices; managing matrix stacks for scene graphs.
- **Animation**: Real-time animation driven by delta time and keyframe-style degree-of-freedom evolution.

---

### [Assignment 1](Assignments/A1/main.html)
#### Question 1 — Scene Setup & Lighting
- WebGL initialization, depth testing, and canvas setup.
- Phong lighting model with ambient, diffuse, and specular products passed as uniforms.

#### Question 2 — Geometry & Primitives
- Construction of 3D primitives: cubes, cylinders, cones, and spheres.
- Vertex and normal arrays for use with `glDrawArrays`.

#### Question 3 — Hierarchical Modeling & Animation
- Matrix stack-based scene graph for hierarchical transforms.
- Animated articulated objects (arms, legs, tentacles) using joint rotations and delta-time real-time animation.

#### Question 4 — Shader Pipeline
- Vertex shader computing per-vertex lighting with model-view and normal matrices.
- Fragment shader outputting interpolated color.

---

### [Assignment 2](Assignments/A2/main.html)
#### Question 1 — Texturing
- Application of five file-based CC0 textures mapped meaningfully to scene objects.
- Custom UV coordinate handling beyond default object coordinates.

#### Question 2 — Camera Fly-Around
- 360-degree camera animation using `lookAt()` and `setMV()`.
- Camera orbits a fixed point of interest in real-time.

#### Question 3 — Fragment Shading & Blinn-Phong
- Converted ADS lighting from a vertex shader to a fragment shader for per-fragment illumination.
- Upgraded Phong to Blinn-Phong using the halfway vector.

#### Question 4 — Novel Shader Effect
- Campfire implemented as a dynamic point light with flickering intensity to simulate unsteady firelight.
- Every shader line commented explaining its purpose and effect.

---

### [Assignment 3](Assignments/A3/pycharm/raytracer.py)
#### Question 1 — Ray Generation & Scene Parsing
- Camera ray construction from pixel coordinates using a configurable image plane (`near`, `top`, `right`).
- Scene file parsing into typed Python dataclasses (`Sphere`, `Light`, `Scene`).

#### Question 2 — Ray-Sphere Intersection
- Intersection solved in unit sphere space via inverse transform matrices.
- Surface normal computed using the inverse transpose for correct world-space normals on scaled spheres.

#### Question 3 — Phong Illumination & Shadows
- Per-light ambient, diffuse, and specular contributions accumulated per intersection.
- Shadow rays cast toward each light with occlusion testing (`t < 1.0`) to avoid self-intersection.

#### Question 4 — Reflections & Recursive Ray Tracing
- Recursive reflection rays up to `MAX_DEPTH = 3`.
- Reflection misses return black; only primary rays return the scene background color on miss.
