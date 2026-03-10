# CSC 305 A2 - Implementation Guide

## Phase 1: Hierarchical Object (Robot Arm)

### Key Principle: Correct Joint Positioning
⚠️ **Critical**: Rotate around the JOIN POINT where children attach to parent, not at the origin!

**Example - Elbow Joint:**
```javascript
gPush();
  // Move to shoulder position
  gTranslate(0, 2, 0);
  // Rotate BEFORE translating forearm (this is the elbow joint)
  gRotate(elbowAngle, 1, 0, 0);  // Rotate around local X
  
  // Draw upper arm from shoulder down
  gPush();
    gTranslate(0, -1, 0);
    gScale(0.2, 1, 0.2);
    drawCube();
  gPop();
  
  // NOW add forearm - it will rotate with the elbow
  gTranslate(0, -1, 0);  // Move to elbow joint location
  gRotate(wristAngle, 1, 0, 0);
  gPush();
    gTranslate(0, -0.8, 0);
    gScale(0.15, 0.8, 0.15);
    drawCube();
  gPop();
gPop();
```

### Animation with Sine Waves
```javascript
// In render() after TIME update:
let shoulderAngle = 30 * Math.sin(TIME * 2.0);      // 30° amplitude, 2 rad/sec
let elbowAngle = -60 * Math.cos(TIME * 1.5 + 1.57); // -60° amplitude, phase shift
let wristAngle = 45 * Math.sin(TIME * 3.0);         // Fast oscillation
```

### Suggested Structure
Create `drawRobotArm()` function that handles the complete hierarchy with animated joints.

---

## Phase 2: Fragment Shader Conversion

### Step-by-Step Process

**1. Create Varying Variables** (passed from vertex to fragment)
```glsl
// In both vertex and fragment shaders
out vec3 vFragPos;       // Position in eye coordinates
out vec3 vFragNormal;    // Normal in eye coordinates  
out vec2 vFragTexCoord;  // Texture coordinates
```

**2. Vertex Shader** (simplified - calculations move to fragment)
```glsl
void main() {
    // Just do transformation - NO lighting
    vFragPos = (modelViewMatrix * vPosition).xyz;
    vFragNormal = normalize((normalMatrix * vec4(vNormal, 0.0)).xyz);
    vFragTexCoord = vTexCoord;
    
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}
```

**3. Fragment Shader** (ALL lighting happens here)
```glsl
void main() {
    // Normalize interpolated normal (smooth shading)
    vec3 N = normalize(vFragNormal);
    
    // Light and view vectors
    vec3 L = normalize(lightPosition.xyz - vFragPos);
    vec3 V = normalize(-vFragPos);
    
    // Half vector for Blinn-Phong
    vec3 H = normalize(L + V);
    
    // Compute ADS lighting
    float NdotL = max(dot(L, N), 0.0);
    vec4 ambient = ambientProduct;
    vec4 diffuse = diffuseProduct * NdotL;
    
    // Blinn-Phong: use H instead of R
    float HdotN = max(dot(H, N), 0.0);
    vec4 specular = specularProduct * pow(HdotN, shininess);
    if (NdotL < 0.0) specular = vec4(0.0, 0.0, 0.0, 1.0);
    
    // Sample texture if available
    vec4 texColor = texture(texture1, vFragTexCoord);
    
    // Combine lighting with texture
    fColor = ambient + diffuse + specular;
    fColor = fColor * texColor;
    fColor.a = 1.0;
}
```

**Key Differences:**
- Vertex shader is MINIMAL - just transforms
- All vec3 calculations (N, L, V, H) happen in fragment
- `max(dot(H, N), 0.0)` for Blinn-Phong instead of `max(dot(R, V), 0.0)` for Phong
- Interpolated normals are smoother due to fragment-level computation

---

## Phase 3: Texture Mapping Strategy

### Option A: Procedural Checkerboard
Easy to implement, counts as "custom texture":
```glsl
// In fragment shader
vec2 checkboardPos = floor(vFragTexCoord * 4.0);
float checkerboard = mod(checkboardPos.x + checkboardPos.y, 2.0);
vec4 texColor = mix(vec4(0.8, 0.8, 0.9, 1.0), vec4(0.2, 0.1, 0.15, 1.0), checkerboard);
```

### Option B: Find New Texture
- OpenGameArt.org - search "metal", "rust", "steel"
- CommonMikoto.org (Wikimedia)
- Must be CC0 or CC-BY with attribution

### Option C: Combination
- Use procedural pattern with subtle variation
- Layer multiple textures with blend modes

### Meaningful Mapping (requirement!)
✅ **Good**: UV scale varies by part (base at 1x, arms at 2x for tighter pattern)
❌ **Bad**: Just slap texture on default cube with default UVs

Example code:
```javascript
// Different UV scales for different parts
gPush();
  gTranslate(0, 0, 0);
  gl.uniform2f(gl.getUniformLocation(program, "uvTile"), 1.0, 1.0);
  drawCube(); // Base: 1x
gPop();

gPush();
  gTranslate(0, 2, 0);
  gl.uniform2f(gl.getUniformLocation(program, "uvTile"), 2.0, 2.0);
  drawCube(); // Arm: 2x tighter
gPop();
```

---

## Phase 4: Novel Shader Effect

### Option 1: Welding Arc Shader ⭐ (Recommended)
Bright glowing effect that follows the robot hand:
```glsl
// Fragment shader addition
vec3 handPos = vec3(sin(TIME) * 3.0, 5.0, cos(TIME) * 3.0);
float dist = length(vFragPos - handPos);
float glow = exp(-dist * dist / 0.5) * 2.0;

vec4 arcColor = vec4(1.0, 0.9, 0.7, 1.0) * glow;
fColor = fColor + arcColor;
```

**Why it works:**
- Simple math (1 line)
- Clear visual effect (you'll see bright glow)
- Uses TIME for animation
- Comments explain each line required

### Option 2: Edge Highlighting
Highlight silhouettes:
```glsl
vec3 N = normalize(vFragNormal);
vec3 V = normalize(-vFragPos);
float edge = 1.0 - abs(dot(N, V));
fColor += vec4(1.0, 0.5, 0.0, 1.0) * pow(edge, 3.0) * 0.5;
```

### Option 3: Metal Shimmer
Animated reflections:
```glsl
float shimmer = sin(TIME * 2.0 + vFragPos.x * 10.0) * 0.5 + 0.5;
fColor += vec4(1.0, 1.0, 1.0, 1.0) * shimmer * 0.3;
```

### Comment Requirements ⚠️
**EVERY shader line must have a comment explaining:**
1. What the line does
2. Why it's needed for the effect

Example format:
```glsl
// Calculate distance from fragment to animated light source to create falloff
float dist = length(vFragPos - handPos);

// Use exponential decay for realistic light falloff with sharper edge than linear
float glow = exp(-dist * dist / 0.5) * 2.0;

// Multiply glow by warm color to create welding arc appearance
vec4 arcColor = vec4(1.0, 0.9, 0.7, 1.0) * glow;

// Add glow on top of existing lighting for additive effect
fColor = fColor + arcColor;
```

---

## Phase 5: Real-Time Performance

### Checklist
- [ ] Scene runs smoothly at 60 FPS (dt should be ~0.016 seconds)
- [ ] Check browser console for no warnings
- [ ] Verify `TIME` is advancing smoothly (log it once per second)
- [ ] No texture loading errors

Quick debug: Add to render():
```javascript
if (Math.floor(TIME) !== Math.floor(TIME - dt)) {
    console.log("FPS Check - TIME:", TIME, "dt:", dt);
}
```

---

## Checklist Before Submission

### Core Requirements
- [ ] 1. Hierarchical object (3 levels, obvious joint motion)
- [ ] 2. Camera flyaround (already works!)
- [ ] 3. Real-time performance
- [ ] 4. Two textures with meaningful mapping
- [ ] 5. Fragment shader (ADS)
- [ ] 6. Blinn-Phong in fragment
- [ ] 7. Novel shader effect (well commented)

### Files
- [ ] Meaningful scene that demonstrates all requirements
- [ ] README.txt explaining each requirement and what was done
- [ ] Movie (20-60 seconds)
- [ ] Cover image from movie
- [ ] All necessary files included

### Code Quality
- [ ] Clear variable names
- [ ] Shader code commented thoroughly
- [ ] Transformations use proper matrix stack
- [ ] No console errors

