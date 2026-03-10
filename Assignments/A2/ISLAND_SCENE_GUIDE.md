# Island Campsite Scene - Implementation Guide

## Scene Overview
```
        🌳 TREE
        (swaying)
           
☀️  ☀️     🏜️   ☀️☀️
        
🪑 CHAIR     🔥 CAMPFIRE
(relaxing)   (flickering)
   
 ❄️ COOLER

        🐬 DOLPHIN (swimming in ocean)
     [in background/sides]
```

---

## 1. Hierarchical Object: Swaying Tree (4 marks)

### Structure Breakdown
```
drawTree() function:
├─ Trunk (scale as cylinder-like)
│  └─ sways slightly on Y-axis (gentle base rotation)
│
├─ Main Branch Left (rotates on X with wind)
│  └─ Sub-branch Left-Top (rotates on Z)
│     └─ Leaf Cluster 1 (bobs up/down)
│
├─ Main Branch Right (rotates on X opposite to left)
│  └─ Sub-branch Right-Top (rotates on Z)
│     └─ Leaf Cluster 2 (bobs up/down)
│
└─ Main Branch Back (rotates on X)
   └─ Sub-branch Back (rotates on Z)
      └─ Leaf Cluster 3 (bobs up/down)
```

### Key Animation Strategy
```javascript
// Different frequencies and phases for natural look
let trunkSway = 5 * Math.sin(TIME * 0.4);           // Slow, gentle
let leftBranchTilt = 25 * Math.sin(TIME * 1.2);     // Medium, opposite phase
let rightBranchTilt = 25 * Math.sin(TIME * 1.2 + Math.PI); // Opposite of left
let leafBob = 0.5 * Math.sin(TIME * 2.5 + 1.57);    // Fast oscillation
```

### Code Template
```javascript
function drawTree() {
    let trunkSway = 5 * Math.sin(TIME * 0.4);
    let windPhase1 = 25 * Math.sin(TIME * 1.2);
    let windPhase2 = 25 * Math.sin(TIME * 1.2 + Math.PI);
    let leafBob1 = 0.3 * Math.sin(TIME * 2.5);
    let leafBob2 = 0.3 * Math.sin(TIME * 2.5 + 2.09);
    let leafBob3 = 0.3 * Math.sin(TIME * 2.5 + 4.19);
    
    gPush();
        // Slight trunk rotation for base movement
        gRotate(trunkSway, 0, 1, 0);
        
        // ===== TRUNK =====
        gPush();
            setColor(vec4(0.4, 0.2, 0.0, 1.0)); // Brown
            gScale(0.3, 2.0, 0.3);
            drawCylinder();
        gPop();
        
        // ===== LEFT MAIN BRANCH =====
        gPush();
            gTranslate(-1.0, 1.5, 0.0);
            gRotate(windPhase1, 1, 0, 0);  // Rotate on X (tilt in/out)
            
            // Left branch stem
            gPush();
                setColor(vec4(0.35, 0.18, 0.0, 1.0)); // Darker brown
                gTranslate(0, 0.4, 0);
                gScale(0.15, 0.8, 0.15);
                drawCylinder();
            gPop();
            
            // Left sub-branch
            gPush();
                gTranslate(0.3, 0.8, 0);
                gRotate(windPhase1 * 0.5, 0, 0, 1);  // Rotate on Z
                
                // Sub-branch stem
                gPush();
                    setColor(vec4(0.3, 0.15, 0.0, 1.0));
                    gTranslate(0.2, 0.3, 0);
                    gScale(0.1, 0.6, 0.1);
                    drawCylinder();
                gPop();
                
                // Leaf cluster
                gPush();
                    gTranslate(0.4, 0.6 + leafBob1, 0);
                    setColor(vec4(0.2, 0.6, 0.2, 1.0)); // Green
                    gScale(0.5, 0.5, 0.5);
                    drawSphere();
                gPop();
            gPop();
        gPop();
        
        // ===== RIGHT MAIN BRANCH (opposite phase) =====
        gPush();
            gTranslate(1.0, 1.5, 0.0);
            gRotate(windPhase2, 1, 0, 0);  // Opposite phase
            
            // Right branch stem
            gPush();
                setColor(vec4(0.35, 0.18, 0.0, 1.0));
                gTranslate(0, 0.4, 0);
                gScale(0.15, 0.8, 0.15);
                drawCylinder();
            gPop();
            
            // Right sub-branch
            gPush();
                gTranslate(-0.3, 0.8, 0);
                gRotate(-windPhase2 * 0.5, 0, 0, 1);
                
                gPush();
                    setColor(vec4(0.3, 0.15, 0.0, 1.0));
                    gTranslate(-0.2, 0.3, 0);
                    gScale(0.1, 0.6, 0.1);
                    drawCylinder();
                gPop();
                
                gPush();
                    gTranslate(-0.4, 0.6 + leafBob2, 0);
                    setColor(vec4(0.2, 0.6, 0.2, 1.0));
                    gScale(0.5, 0.5, 0.5);
                    drawSphere();
                gPop();
            gPop();
        gPop();
        
        // ===== BACK BRANCH =====
        gPush();
            gTranslate(0, 1.5, 0.8);
            gRotate(windPhase1 * 0.7, 1, 0, 0);
            
            gPush();
                setColor(vec4(0.35, 0.18, 0.0, 1.0));
                gTranslate(0, 0.3, 0);
                gScale(0.12, 0.6, 0.12);
                drawCylinder();
            gPop();
            
            gPush();
                gTranslate(0, 0.6, 0.3);
                gRotate(windPhase1 * 0.3, 0, 0, 1);
                setColor(vec4(0.2, 0.6, 0.2, 1.0));
                gScale(0.45, 0.45, 0.45);
                drawSphere();
            gPop();
        gPop();
    gPop();
}
```

### Why This Works
- ✅ 3+ levels of hierarchy: trunk → branch → sub-branch → leaves
- ✅ Clear joint motion: each level rotates at its attachment point
- ✅ Natural animation: different frequencies create organic movement
- ✅ Gravity-aware: branches rotate around their base (gTranslate before gRotate)

---

## 2. Campfire with Animated Flames

### Code
```javascript
function drawCampfire() {
    setColor(vec4(0.3, 0.15, 0.05, 1.0)); // Dark wood brown
    
    // ===== LOGS (base, stationary) =====
    gPush();
        gRotate(45, 0, 1, 0);
        gScale(0.3, 0.1, 2.0);
        drawCube();
    gPop();
    
    gPush();
        gRotate(-45, 0, 1, 0);
        gScale(0.3, 0.1, 2.0);
        drawCube();
    gPop();
    
    // ===== FLAMES (animated cylinders that scale up/down) =====
    // This will be enhanced with the novel shader effect!
    
    let flameIntensity1 = 0.5 + 0.5 * Math.sin(TIME * 4.0);
    let flameIntensity2 = 0.5 + 0.5 * Math.sin(TIME * 4.5 + 1.0);
    let flameIntensity3 = 0.5 + 0.5 * Math.sin(TIME * 3.8 + 2.1);
    
    // Flame 1
    gPush();
        gTranslate(-0.3, 0.2, 0);
        setColor(vec4(1.0, 0.7, 0.0, flameIntensity1)); // Yellow-orange
        gScale(0.2, 0.8 * flameIntensity1, 0.2);
        drawCone();
    gPop();
    
    // Flame 2
    gPush();
        gTranslate(0.3, 0.2, 0);
        setColor(vec4(1.0, 0.5, 0.0, flameIntensity2)); // Orange
        gScale(0.2, 0.8 * flameIntensity2, 0.2);
        drawCone();
    gPop();
    
    // Flame 3 (center, tallest)
    gPush();
        gTranslate(0, 0.3, 0);
        setColor(vec4(1.0, 0.8, 0.2, flameIntensity3)); // Bright yellow
        gScale(0.25, 1.0 * flameIntensity3, 0.25);
        drawCone();
    gPop();
}
```

### Shader Effect on Fire
The novel shader will add glow to these flames - more on this below.

---

## 3. Cooler (Simple)

```javascript
function drawCooler() {
    setColor(vec4(0.8, 0.2, 0.1, 1.0)); // Red color
    
    // Main box
    gPush();
        gScale(0.6, 0.5, 0.8);
        drawCube();
    gPop();
    
    // Lid (can be slightly offset for detail)
    gPush();
        gTranslate(0, 0.3, 0);
        setColor(vec4(0.3, 0.3, 0.3, 1.0)); // Dark gray
        gScale(0.65, 0.1, 0.85);
        drawCube();
    gPop();
    
    // Handle (cylinder arched)
    gPush();
        gTranslate(0, 0.6, 0);
        setColor(vec4(0.2, 0.2, 0.2, 1.0)); // Black
        gScale(0.15, 0.2, 0.6);
        drawCylinder();
    gPop();
}
```

---

## 4. Island Layout in render()

```javascript
function render(timestamp) {
    // ... existing animation code ...
    
    // Compute TIME as before
    // ... camera flyaround is already done ...
    
    // ===== ISLAND FLOOR =====
    gPush();
        useGround080Texture();
        gTranslate(0, -3, 0);
        gScale(20, 0.5, 20); // Large flat plane
        drawCube();
    gPop();
    
    // ===== TREE (center-left of island) =====
    gPush();
        gTranslate(-4, -2, 0);
        drawTree();
    gPop();
    
    // ===== CHAIR (near tree) =====
    gPush();
        gTranslate(-2, -2.5, -3);
        gScale(0.5, 0.5, 0.5);
        useWood086Texture();
        drawChair();
    gPop();
    
    // ===== CAMPFIRE (right side) =====
    gPush();
        gTranslate(3, -2.5, 0);
        drawCampfire();
    gPop();
    
    // ===== COOLER (near chair) =====
    gPush();
        gTranslate(1, -2.5, -2);
        drawCooler();
    gPop();
    
    // ===== DOLPHIN (swimming in water/around island) =====
    gPush();
        // Use existing drawDolphin
        drawDolphin(dt, -1.5, 8, 0.5);
    gPop();
    
    // ===== OCEAN/WATER (background) =====
    gPush();
        setColor(vec4(0.1, 0.3, 0.8, 0.7)); // Blue with transparency
        gTranslate(0, -2, 15);
        gScale(30, 2, 15);
        drawCube();
    gPop();
    
    if (animFlag) { window.requestAnimFrame(render); }
}
```

---

## 5. Novel Shader Effect: Flickering Fire Glow

The campfire flames will use your new fragment shader with an additive glow effect:

```glsl
// In fragment shader, add this section before the final fColor output:

// ===== FIRE GLOW EFFECT =====
// Calculate distance from fragment to a bright point above the campfire
vec3 fireCenter = vec3(0.0, 2.0, 0.0);  // Center of fire in world space
// Note: You'll need to pass campfire position via uniform or hard-code for now

// Compute distance from current fragment to fire center
float distToFire = length(vFragPos - fireCenter);

// Create exponential falloff for realistic light decay from intensity source
float fireGlow = exp(-distToFire * distToFire / 2.0);

// Multiply by animated brightness using TIME for flickering effect
float flicker = 0.5 + 0.5 * sin(TIME * 4.0);
fireGlow *= flicker;

// Add warm fire colors (orange/yellow) to fragments near fire
vec4 fireLight = vec4(1.0, 0.6, 0.2, 1.0) * fireGlow * 0.5;

// Add fires glow on top of existing lighting
fColor += fireLight;
```

**Why this works:**
- Uses `exp()` for realistic light falloff
- `sin(TIME * 4.0)` creates flickering animation
- Additive blending makes it look like light is being emitted
- Every line is easily commentable per assignment requirement

---

## 6. Putting It All Together

### File Structure
You'll need to add these functions to **prefabs.js**:
- `drawTree()`
- `drawCampfire()`
- `drawCooler()`

Then call them in **main.js render()** function as shown above.

### Checklist for This Scene
- [ ] `drawTree()` works with 3 levels + sway animation
- [ ] `drawCampfire()` shows flickering flames
- [ ] `drawCooler()` displays with detail
- [ ] Chair positions correctly (existing code)
- [ ] Dolphin swims around island (existing code, adjust parameters)
- [ ] Island floor is visible and textured
- [ ] Ocean background frames the scene
- [ ] All animations use TIME and run smoothly

---

## Next Steps

1. **Add these three functions to prefabs.js** (tree, campfire, cooler)
2. **Update main.js render()** with the island layout
3. **Convert shaders** to fragment shader + Blinn-Phong (separate task)
4. **Add fire glow effect** to fragment shader (novel effect)
5. **Verify real-time performance** and smooth animations
6. **Test textures** on appropriate objects
7. **Record scene** and create README

This gives you:
- ✅ Hierarchical tree (4 marks)
- ✅ Clear animation with TIME (3 marks)
- ✅ Real-time performance (3 marks)
- ✅ Creative island scene (10+ marks)
- ✅ Novel fire shader (5 marks)
- ⏳ Textures (need to expand mapping - 6 marks)
- ⏳ Fragment shader (5 marks)
- ⏳ Blinn-Phong (2 marks)
