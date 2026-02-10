
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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(0, 0, 10);
    MS = []; // Initialize modeling matrix stack

    // initialize the modeling matrix to identity
    modelMatrix = mat4();

    // set the camera matrix
    viewMatrix = lookAt(eye, at, up);

    // set the projection matrix
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);


    // set all the matrices
    setAllMatrices();

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

    // I was gonna expose all of these parameters in the html so you could play with it in real time
    // but i realize that was a waste of time lol so enjoy this wall of parameters. 
    const leftArmRotation = sinAnimateValueBetween(20, 40, 7, TIME);
    const rightArmRotation = sinAnimateValueBetween(-40, -20, 7, TIME);
    const upperRightLegRotation = sinAnimateValueBetween(-5, 20, 7, TIME);
    const lowerRightLegRotation = sinAnimateValueBetween(5, 35, 7, TIME);
    const upperLeftLegRotation = sinAnimateValueBetween(20, -5, 7, TIME);
    const lowerLeftLegRotation = sinAnimateValueBetween(35, 5, 7, TIME);
    const astronautYposition = sinAnimateValueBetween(4, -4, 40, TIME);
    const astronautXposition = sinAnimateValueBetween(3, -5, 40, TIME);


    let astronautPosition = [astronautXposition, astronautYposition, 0];
    let astronautRotation = [20, -40, 0];
    const astronautScale = 0.6;

    const jellyFishHeight = 1.5;
    const jellyFishRadius = 6;
    const jellyFishScale = 0.8;
    const jellyFishSpeedRotationTime = 15;
    const jellyFishRotation = lerpAnimateCyclicBetween(0, 360, jellyFishSpeedRotationTime, TIME);
    const tentacleLength = 5;
    const waveSpeed = 1;
    const waveFreq = 1;
    const waveAmp = 15;

    const starCount = 30;
    const starSpeed = 2;
    const starAngle = 30;
    let starRadius = 5;
    
    drawStars();

    //Body 
    gPush(); {
        // Apply astronaut transformations
        gScale(astronautScale, astronautScale, astronautScale);
        gRotate(astronautRotation[0], 1, 0, 0);
        gRotate(astronautRotation[1], 0, 1, 0);
        gRotate(astronautRotation[2], 0, 0, 1);
        gTranslate(astronautPosition[0], astronautPosition[1], astronautPosition[2]);


        gPush(); {
            // BODY
            gPush(); {
                setColor(vec4(1.0, 1.0, 1.0, 1.0));
                gScale(0.99, 1.32, 0.44);
                drawCube();
            } gPop();

            // BODY BUTTONS
            gPush(); {
                // NASA PATCH
                gPush(); {
                    gTranslate(-0.4, 0.7, 0.435);
                    gScale(0.3, 0.3, 0.01);
                    setColor(vec4(0.0, 0.0, 1.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 1
                gPush(); {
                    gTranslate(-0.3, -1, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(1.0, 0.0, 0.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 2
                gPush(); {
                    gTranslate(0.3, -1, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(1.0, 0.0, 0.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 3
                gPush(); {
                    gTranslate(-0.4, -0.5, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(0.5, 0.7, 1.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 4
                gPush(); {
                    gTranslate(0.4, -0.5, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(0.5, 0.7, 1.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 5
                gPush(); {
                    gTranslate(-0.3, 0, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(0.3, 0.3, 1.0, 1.0));
                    drawSphere();
                } gPop();

                // BUTTON 6
                gPush(); {
                    gTranslate(0.3, 0, 0.435);
                    gScale(0.15, 0.15, 0.1);
                    setColor(vec4(0.3, 0.3, 1.0, 1.0));
                    drawSphere();
                } gPop();


            } gPop();


            // ARMS
            drawArm(rightArmRotation, false, 1);
            drawArm(leftArmRotation, true, 1);

            // LEGS
            drawLeg(upperRightLegRotation, lowerRightLegRotation, -0.5);
            drawLeg(upperLeftLegRotation, lowerLeftLegRotation, 0.5);
        } gPop();

        // BUILD HEAD -> Visor
        gPush(); {
            gTranslate(0, 1.95, 0)

            gPush(); {
                setColor(vec4(1.0, 1.0, 1.0, 1.0));
                gScale(0.75, 0.75, 0.75);
                drawSphere();
            } gPop();

            //Set Visors position relative to head position
            gPush(); {
                gTranslate(0, 0.07, 0.38);
                gScale(0.6, 0.55, 0.4);
                setColor(vec4(1.0, 0.65, 0.0, 1.0));
                drawSphere();
            } gPop();

        } gPop();
    } gPop();

    //Jelly Fish
    gPush(); {
        gRotate(jellyFishRotation, 0, 1, 0);

        gPush(); {
            setColor(vec4(1.0, 0.2, 0.6, 1.0));
            gScale(jellyFishScale, jellyFishScale, jellyFishScale);
            gTranslate(jellyFishRadius, jellyFishHeight, 0);

            // JELLYFISH HEAD
            gPush(); {
                gScale(1, 1, 0.5);
                drawSphere();
            } gPop();

            // JELLYFISH BODY
            gPush(); {
                gTranslate(0, 0, 0.6);
                gScale(0.7, 0.7, 0.4);
                drawSphere();
            } gPop();

            drawTenticle([0, 0, 0.5]);
            drawTenticle([0, 0.4, 0.5]);
            drawTenticle([0, -0.4, 0.5]);
        }

    } gPop();


    function drawArm(armRotation, isMirrored, heightOffset) {
        const mirrorSign = isMirrored ? 1 : -1;
        const shoulderOffsetX = isMirrored ? -0.06 : 0.06;
        const shoulderOffsetY = isMirrored ? 0.05 : -0.05;

        gPush(); {
            setColor(vec4(1.0, 1.0, 1.0, 1.0));
            gTranslate(mirrorSign, heightOffset, 0);
            gRotate(armRotation, 0, 0, 1);

            // SHOULDERS
            gPush(); {
                gRotate(45, 0, 0, 1);
                gTranslate(shoulderOffsetX, shoulderOffsetY, 0);
                gScale(0.2, 0.2, 0.2);
                drawCube();
            } gPop();

            // ARM BODY
            gPush(); {
                gScale(0.2, 0.9, 0.2);
                gTranslate(0, -1, 0);
                drawCube();
            } gPop();
        } gPop();
    }

    function drawLeg(upperLegRotation, lowerLegRotation, centerOffsetX) {
        gPush(); {
            // SET ROTATION ORIGIN
            setColor(vec4(1.0, 1.0, 1.0, 1.0));
            gTranslate(centerOffsetX, -1, 0);

            gRotate(upperLegRotation, 1, 0, 0);

            // DRAW UPPER LEG
            gPush(); {
                gTranslate(0, -0.9, 0);
                gPush(); {
                    gScale(0.2, 0.65, 0.2);
                    drawCube();
                } gPop();

                gPush(); {
                    // SET KNEE ROTATION ORIGIN
                    gTranslate(0, -0.56, 0);
                    gRotate(lowerLegRotation, 1, 0, 0);

                    gPush(); {
                        gTranslate(0, -0.8, 0);

                        // LOWER LEG
                        gPush(); {
                            gScale(0.2, 0.8, 0.2);
                            drawCube();
                        } gPop();

                        // FOOT
                        gPush(); {
                            gTranslate(0, -0.7, 0.4);
                            gScale(0.2, 0.1, 0.3);
                            drawCube();
                        } gPop();
                    } gPop();
                } gPop();
            } gPop();
        } gPop();
    }

    function drawTenticle(offset) {
        gPush(); {
            const tentacleOffset = offset || [0, 0, 0.5];
            gTranslate(tentacleOffset[0], tentacleOffset[1], tentacleOffset[2]);

            setColor(vec4(0.76, 0.35, 0.15, 1.0));

            // DRAW EACH TENTACLE SEGMENT
            for (i = 0; i < tentacleLength; i++) {
                // OFFSET EACH SEGMENT / SET ROTATION ORIGIN
                gTranslate(0, 0, 0.55);

                
                const phase = i * waveFreq - TIME * waveSpeed; // Wave function
                gRotate(waveAmp * Math.sin(phase), 1, 0, 0); //Rotate segment
                gPush(); {
                    gTranslate(0, 0, 0.2);
                    gScale(0.1, 0.1, 0.3);
                    drawSphere();
                } gPop();
            }
        } gPop();
    }

    function drawStars() {
        for (let i = 0; i < starCount; i++) {
            gPush(); {
                // compute animation based off of angle and speed
                let xPos = Math.cos(rad(starAngle)) * TIME * starSpeed;
                let yPos = Math.sin(rad(starAngle)) * TIME * starSpeed;

                // random offset
                xPos += randomFloatBetween(-6, 6, i);
                yPos += randomFloatBetween(-6, 6, i**2);
                // random scale
                let scaledRadius = starRadius * randomFloatBetween(0.005, 0.010, i);

                // wrap around the scene    
                while (xPos > 6) xPos -= 12;
                while (xPos < -6) xPos += 12;
                while (yPos > 6) yPos -= 12;
                while (yPos < -6) yPos += 12;


                

                gTranslate(xPos, yPos, -20);
                setColor(vec4(1.0, 1.0, 1.0, 1.0));
                gScale(scaledRadius, scaledRadius, scaledRadius);
                drawSphere();
            } gPop();
        }
    }

    if (animFlag) { window.requestAnimFrame(render) };
}