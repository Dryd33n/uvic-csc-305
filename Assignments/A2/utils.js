function setMV() {
    modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    normalMatrix = inverseTranspose(modelViewMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));
}
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    setMV();
}
function drawCube() {
    setMV();
    Cube.draw();
}
function drawSphere() {
    setMV();
    Sphere.draw();
}
function drawCylinder() {
    setMV();
    Cylinder.draw();
}
function drawCone() {
    setMV();
    Cone.draw();
}
function gTranslate(x, y, z) {
    modelMatrix = mult(modelMatrix, translate([x, y, z]));
}
function gRotate(theta, x, y, z) {
    modelMatrix = mult(modelMatrix, rotate(theta, [x, y, z]));
}
function gScale(sx, sy, sz) {
    modelMatrix = mult(modelMatrix, scale(sx, sy, sz));
}
function gShear(sxy, sxz, syx, syz, szx, szy) {
    var shear = mat4();
    shear[0][1] = sxy;
    shear[0][2] = sxz;
    shear[1][0] = syx;
    shear[1][2] = syz;
    shear[2][0] = szx;
    shear[2][1] = szy;
    modelMatrix = mult(modelMatrix, shear);
}
function gPop() {
    modelMatrix = MS.pop();
}
function gPush() {
    MS.push(modelMatrix);
}

function sinAnimateValueBetween(min, max, period, dt) {
    const amplitude = (max - min) / 2;
    const midPoint = (max + min) / 2;
    const angularFrequency = (2 * Math.PI) / period;
    return midPoint + amplitude * Math.sin(angularFrequency * dt);
}

function lerpAnimateCyclicBetween(min, max, period, time) {
    const range = max - min;
    const t = (time % period) / period;
    return min + range * t;
}

function deg(radians) {
    return radians * 180 / Math.PI;
}

function rad(degrees) {
    return degrees * Math.PI / 180;
}

function randomFloatBetween(min, max, seed) {
    let random;
    if (seed !== undefined) {
        const x = Math.sin(seed) * 10000;
        random = x - Math.floor(x);
    } else {
        random = Math.random();
    }
    return random * (max - min) + min;
}
function setColor(c) {
    ambientProduct = mult(lightAmbient, c);
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

