
var canvas;
var gl;

var program;

var near = 1;
var far = 100;


var left = -6.0;
var right = 6.0;
var ytop = 6.0;
var bottom = -6.0;


var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0);
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0);

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix, modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0;
var RY = 0;
var RZ = 0;

var MS = []; // The modeling matrix stack
var TIME = 0.0; // Realtime
var dt = 0.0
var prevTime = 0.0;
var resetTimerFlag = true;
var animFlag = false;
var controller;
var textureTileX = 1.5;
var textureTileY = 1.5;
var ground080Texture = null;
var wood086Texture = null;
var plastic002Texture = null;
var bark014Texture = null;
var treeEnd004Texture = null;
var chairTextureTileX = 0.5;
var chairTextureTileY = 0.5;
var coolerTextureTileX = 0.4;
var coolerTextureTileY = 0.4;
var barkTextureTileX = 0.5;
var barkTextureTileY = 2.0;
var treeEndTextureTileX = 1;
var treeEndTextureTileY = 1;

var fireLightWorld = vec4(-2.0, -2.35, -2.0, 1.0);
var moonDirectionWorld = vec3(0.18, 1.0, 0.08);

function transformPointByMat4(m, p) {
    return vec4(
        m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2] + m[0][3] * p[3],
        m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2] + m[1][3] * p[3],
        m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2] + m[2][3] * p[3],
        m[3][0] * p[0] + m[3][1] * p[1] + m[3][2] * p[2] + m[3][3] * p[3]
    );
}

function transformDirByMat4(m, d) {
    return vec3(
        m[0][0] * d[0] + m[0][1] * d[1] + m[0][2] * d[2],
        m[1][0] * d[0] + m[1][1] * d[1] + m[1][2] * d[2],
        m[2][0] * d[0] + m[2][1] * d[1] + m[2][2] * d[2]
    );
}

function loadGround080Texture() {
    var colorMapPath = "Textures/Ground080_2K-JPG/Ground080_2K-JPG_Color.jpg";
    var image = new Image();

    image.onload = function () {
        ground080Texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, ground080Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        render(0);
    };

    image.src = colorMapPath;
}

function useGround080Texture() {
    if (!ground080Texture) {
        gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
        return;
    }

    // Keep texture albedo neutral instead of tinting by the global orange material.
    setColor(vec4(1.0, 1.0, 1.0, 1.0));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ground080Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);

    // Reuse same map for texture2 so Lab7 blend path remains valid.
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, ground080Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 1);
    gl.uniform2f(gl.getUniformLocation(program, "uvTile"), textureTileX, textureTileY);
}

function loadWood086Texture() {
    var colorMapPath = "Textures/Wood086_2K-JPG/Wood086_2K-JPG_Color.jpg";
    var image = new Image();

    image.onload = function () {
        wood086Texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, wood086Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        render(0);
    };

    image.src = colorMapPath;
}

function useWood086Texture() {
    if (!wood086Texture) {
        gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
        return;
    }

    // Keep texture albedo neutral instead of tinting by the global orange material.
    setColor(vec4(1.0, 1.0, 1.0, 1.0));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wood086Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);

    // Reuse same map for texture2 so Lab7 blend path remains valid.
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, wood086Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 2);
    gl.uniform2f(gl.getUniformLocation(program, "uvTile"), chairTextureTileX, chairTextureTileY);
}

function loadPlastic002Texture() {
    var colorMapPath = "Textures/Plastic002_2K-JPG/Plastic002_2K-JPG_Color.jpg";
    var image = new Image();

    image.onload = function () {
        plastic002Texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, plastic002Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        render(0);
    };

    image.src = colorMapPath;
}

function usePlastic002Texture() {
    if (!plastic002Texture) {
        gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
        return;
    }

    // Keep albedo un-tinted so the plastic map shows as authored.
    setColor(vec4(1.0, 1.0, 1.0, 1.0));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, plastic002Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, plastic002Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 2);
    gl.uniform2f(gl.getUniformLocation(program, "uvTile"), coolerTextureTileX, coolerTextureTileY);
}

function loadBark014Texture() {
    var colorMapPath = "Textures/Bark014_2K-JPG/Bark014_2K-JPG_Color.jpg";
    var image = new Image();

    image.onload = function () {
        bark014Texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bark014Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        render(0);
    };

    image.src = colorMapPath;
}

function useBark014Texture() {
    if (!bark014Texture) {
        gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
        return;
    }

    setColor(vec4(1.0, 1.0, 1.0, 1.0));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bark014Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bark014Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 2);
    gl.uniform2f(gl.getUniformLocation(program, "uvTile"), barkTextureTileX, barkTextureTileY);
}

function loadTreeEnd004Texture() {
    var colorMapPath = "Textures/TreeEnd004_2K-JPG/TreeEnd004_2K-JPG_Color.jpg";
    var image = new Image();

    image.onload = function () {
        treeEnd004Texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, treeEnd004Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        render(0);
    };

    image.src = colorMapPath;
}

function useTreeEnd004Texture() {
    if (!treeEnd004Texture) {
        gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
        return;
    }

    setColor(vec4(1.0, 1.0, 1.0, 1.0));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, treeEnd004Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, treeEnd004Texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 0);
    gl.uniform2f(gl.getUniformLocation(program, "uvTile"), treeEndTextureTileX, treeEndTextureTileY);
}

function useSolidColorMaterial() {
    gl.uniform1i(gl.getUniformLocation(program, "blendTextures"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "projectionMode"), 0);
}

// These are used to store the current state of objects.
// In animation it is often useful to think of an object as having some DOF
// Then the animation is simply evolving those DOF over time. You could very easily make a higher level object that stores these as Position, Rotation (and also Scale!)


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    setColor(materialDiffuse);

    // Initialize some shapes, note that the curved ones are procedural which allows you to parameterize how nice they look
    // Those number will correspond to how many sides are used to "estimate" a curved surface. More = smoother
    Cube.init(program);
    Cylinder.init(20, program);
    Cone.init(20, program);
    Sphere.init(36, program);

    // Matrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // Lighting Uniforms
    gl.uniform4fv(gl.getUniformLocation(program,
        "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program,
        "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"), materialShininess);
    gl.uniform2f(gl.getUniformLocation(program,
        "uvTile"), textureTileX, textureTileY);
    gl.uniform1i(gl.getUniformLocation(program,
        "projectionMode"), 0);
    gl.uniform3fv(gl.getUniformLocation(program,
        "moonDirection"), flatten(normalize(moonDirectionWorld)));
    gl.uniform4fv(gl.getUniformLocation(program,
        "moonAmbient"), flatten(vec4(0.05, 0.08, 0.12, 1.0)));
    gl.uniform4fv(gl.getUniformLocation(program,
        "moonDiffuse"), flatten(vec4(0.22, 0.28, 0.38, 1.0)));
    gl.uniform1f(gl.getUniformLocation(program,
        "fireAttenLinear"), 0.35);
    gl.uniform1f(gl.getUniformLocation(program,
        "fireAttenQuadratic"), 0.18);



    loadGround080Texture();
    loadWood086Texture();
    loadPlastic002Texture();
    loadBark014Texture();
    loadTreeEnd004Texture();
    

    document.getElementById("animToggleButton").onclick = function () {
        if (animFlag) {
            animFlag = false;
        }
        else {
            animFlag = true;
            resetTimerFlag = true;
            window.requestAnimFrame(render);
        }
        //console.log(animFlag);
    };

    render(0);
}

function render(timestamp) {
    if (animFlag) {
        // dt is the change in time or delta time from the last frame to this one
        // in animation typically we have some property or degree of freedom we want to evolve over time
        // For example imagine x is the position of a thing.
        // To get the new position of a thing we do something called integration
        // the simpelst form of this looks like:
        // x_new = x + v*dt
        // That is, the new position equals the current position + the rate of of change of that position (often a velocity or speed) times the change in time
        // We can do this with angles or positions, the whole x,y,z position, or just one dimension. It is up to us!
        dt = (timestamp - prevTime) / 1000.0;
        prevTime = timestamp;
        TIME += dt;
    }


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 0, 10);
    MS = []; // Initialize modeling matrix stack

    // initialize the modeling matrix to identity
    modelMatrix = mat4();

    // set the camera matrix
    let cameraRadius = 15.0;
    let cameraHeight = 10.0;
    let cameraRotationSpeed = 0.5; // radians per second
    let cameraLookAtHeight = 0.0;

    eye = vec3(cameraRadius * Math.cos(TIME * cameraRotationSpeed), cameraHeight, cameraRadius * Math.sin(TIME * cameraRotationSpeed));
    at = vec3(0.0, cameraLookAtHeight, 0.0);

    viewMatrix = lookAt(eye, at, up);

    var moonDirEye = transformDirByMat4(viewMatrix, moonDirectionWorld);
    var moonLen = Math.sqrt(moonDirEye[0] * moonDirEye[0] + moonDirEye[1] * moonDirEye[1] + moonDirEye[2] * moonDirEye[2]);
    if (!isFinite(moonLen) || moonLen < 1e-6) {
        moonDirEye = vec3(0.0, 1.0, 0.0);
    } else {
        moonDirEye = vec3(moonDirEye[0] / moonLen, moonDirEye[1] / moonLen, moonDirEye[2] / moonLen);
    }
    gl.uniform3fv(gl.getUniformLocation(program, "moonDirection"), flatten(moonDirEye));

    // Keep the point light at the campfire with a strong base and subtle flicker.
    var firePulse = 1.55 + 0.08 * Math.sin(TIME * 4.0);
    var fireGlowRadius = 0.22 + 0.015 * Math.sin(TIME * 4.0);
    fireLightWorld = vec4(
        -2.0 + 0.04 * Math.sin(TIME * 3.5),
        -2.35 + 0.05 * Math.sin(TIME * 5.5),
        -2.0 + 0.04 * Math.cos(TIME * 4.0),
        1.0
    );

    lightAmbient = vec4(0.48 * firePulse, 0.22 * firePulse, 0.08 * firePulse, 1.0);
    lightDiffuse = vec4(1.80 * firePulse, 1.02 * firePulse, 0.40 * firePulse, 1.0);
    lightSpecular = vec4(1.65 * firePulse, 1.08 * firePulse, 0.50 * firePulse, 1.0);
    lightPosition = transformPointByMat4(viewMatrix, fireLightWorld);

    // set the projection matrix with aspect correction
    var aspect = canvas.width / canvas.height;
    var projLeft = left;
    var projRight = right;
    var projBottom = bottom;
    var projTop = ytop;

    if (aspect >= 1.0) {
        projLeft *= aspect;
        projRight *= aspect;
    } else {
        projBottom /= aspect;
        projTop /= aspect;
    }

    projectionMatrix = ortho(projLeft, projRight, projBottom, projTop, near, far);



    // set all the matrices
    setAllMatrices();

    // ===== TINY STRANDED ISLAND SCENE =====
    
    // ===== SURROUNDING OCEAN (Vast and isolating) =====
    gPush();

         useWood086Texture();
        
        setColor(vec4(0.05, 0.2, 0.6, 1.0)); // Deep ocean blue
        gTranslate(0, -4, 8);
        gScale(50, 1, 50); // Surround the island with deep water
        drawCube();
    gPop();

    // ===== SMALL ISLAND FLOOR (Tiny sand patch - spherical) =====
    gPush();
        useGround080Texture();
        gTranslate(0, -3, 0);
        gScale(4, 0.5, 4); // Spherical island instead of flat square
        drawSphere();
    gPop();

    gPush();
        useWood086Texture();
        gScale(0.4, 0.4, 0.4);
        gTranslate(0, -5, -7);
        drawChair();
    gPop();

    gPush();
        gTranslate(2, -2.5, -2);
        gScale(0.6, 0.6, 0.6);
        gRotate(45, 0, 1, 0);
        usePlastic002Texture();
        drawCooler();
    gPop();

    gPush();
        gTranslate(-2, -2.6, -2);
        gScale(0.6, 0.6, 0.6);
        gRotate(45, 0, 1, 0);
        usePlastic002Texture();
        drawCampfire();
    gPop();

    useSolidColorMaterial();

    // Wavy grass clumps made from sheared vertical planes.
    gPush();
        gTranslate(-1.5, -2.55, -0.7);
        gScale(0.9, 0.9, 0.9);
        drawWavyGrassPatch(16, 0.7, 0.0);
    gPop();

    gPush();
        gTranslate(-2.25, -2.55, 0);
        gScale(0.8, 0.8, 0.8);
        drawWavyGrassPatch(14, 0.6, 1.7);
    gPop();

    gPush();
        gTranslate(-3, -2.55, -0.7);
        gScale(0.75, 0.75, 0.75);
        drawWavyGrassPatch(12, 0.55, 3.1);
    gPop();

    // Textured drift log near the island edge.
    gPush();
        gTranslate(-1, -2.5 , 1);
        gRotate(30, 0, 1, 0);
        gRotate(7, 0, 0, 1);
        gScale(2, 2, 2);
        drawBeachLog();
    gPop();

    useSolidColorMaterial();

    gPush();
        gTranslate(0, -1.5, -10); // Offset into ocean
        //drawDolphin(dt, -1.5, 12, 0.5);
    gPop();





    

    if (animFlag) { window.requestAnimFrame(render) };
}