function drawChair() {
	gPush();
		gTranslate(0, 0.5, 2.7);
		gScale(2.2,0.1,0.1)
		drawCube();
	gPop();

	gPush();
		gTranslate(1.9, 0.65, 0.6);
		gScale(0.3,0.1,2.2)
		drawCube();
	gPop();

	gPush();
		gTranslate(1.65, 0.55, 0.6);
		gScale(0.05,0.2,2.2)
		drawCube();
	gPop();

	gPush();
		gTranslate(-1.9, 0.65, 0.6);
		gScale(0.3,0.1,2.2)
		drawCube();
	gPop();

	gPush();
		gTranslate(-1.65, 0.55, 0.6);
		gScale(0.05,0.2,2.2)
		drawCube();
	gPop();

	gPush();
		gTranslate(-1.6, -0.75, -1.3);
		gScale(0.1,1.5,0.3)
		drawCube();
	gPop();

	gPush();
		gTranslate(-1.6, -0.3, 0.8);
		gRotate(100, 1, 0, 0);
		gScale(0.1,2,0.3)
		drawCube();
	gPop();

	gPush();
		gTranslate(-1.6, -2.1, 3.9);
		gRotate(140, 1, 0, 0);
		gTranslate(0,-1.1,0)
		gScale(0.1,0.9,0.3)
		drawCube();
	gPop();


	gPush();
		gTranslate(1.6, -0.75, -1.3);
		gScale(0.1,1.5,0.3)
		drawCube();
	gPop();

	gPush();
		gTranslate(1.6, -0.3, 0.8);
		gRotate(100, 1, 0, 0);
		gScale(0.1,2,0.3)
		drawCube();
	gPop();

	gPush();
		gTranslate(1.6, -2.1, 3.9);
		gRotate(140, 1, 0, 0);
		gTranslate(0,-1.1,0)
		gScale(0.1,0.9,0.3)
		drawCube();
	gPop();

	gPush();
		gRotate(10, 1, 0, 0);

		gPush();
			gTranslate(0, -0.15, -0.65);
			gRotate(-30,1, 0, 0);
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gTranslate(0, -0.7, -1.0);
			gRotate(-80,1, 0, 0);
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gTranslate(0, 0, 0.65);
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gTranslate(0, 0, 1.3);
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gTranslate(0, 0, 1.95);
			gScale(1.5, 0.1, 0.25);
			drawCube();
		gPop();

		gPush();
			gTranslate(0, 0.8, 0);
			gRotate(15, 1, 0, 0);

			gPush();
				gTranslate(-1.25, 1.5, 2.3);
				gScale(0.25, 1.7, 0.1);
				drawCube();
			gPop();

			gPush();
				gTranslate(0.6, 1.5, 2.3);
				gScale(0.25, 1.7, 0.1);
				drawCube();
			gPop();

			gPush();
				gTranslate(0, 1.5, 2.3);
				gScale(0.25, 1.7, 0.1);
				drawCube();
			gPop();

			gPush();
				gTranslate(-0.6, 1.5, 2.3);
				gScale(0.25, 1.7, 0.1);
				drawCube();
			gPop();

			gPush();
				gTranslate(1.25, 1.5, 2.3);
				gScale(0.25, 1.7, 0.1);
				drawCube();
			gPop();
		gPop();
	gPop();
}


function drawCampfire() {
	setColor(vec4(0.3, 0.15, 0.05, 1.0)); 

	gPush();
		gRotate(45, 0, 1, 0);
		gRotate(90, 1, 0, 0); 
		gScale(0.12, 0.12, 1.3);
		drawCylinder();
	gPop();

	gPush();
		gRotate(-45, 0, 1, 0);
		gRotate(90, 1, 0, 0); 
		gScale(0.12, 0.12, 1.3);
		drawCylinder();
	gPop();

	gPush();
		gRotate(10, 0, 1, 0);
		gRotate(90, 1, 0, 0);
		gTranslate(0, -0.08, 0);
		gScale(0.1, 0.1, 1.15);
		drawCylinder();
	gPop();

	gPush();
		gRotate(95, 0, 1, 0);
		gRotate(90, 1, 0, 0);
		gTranslate(0, -0.08, 0);
		gScale(0.1, 0.1, 1.1);
		drawCylinder();
	gPop();

	gPush();
		gRotate(-80, 0, 1, 0);
		gRotate(90, 1, 0, 0);
		gTranslate(0, -0.08, 0);
		gScale(0.09, 0.09, 1.0);
		drawCylinder();
	gPop();

	let extraLogAngles = [30, -25, 62, -58, 118, -112, 152];
	let extraLogLengths = [1.2, 1.1, 1.05, 1.15, 1.0, 1.08, 0.98];
	for (let i = 0; i < 7; i++) {
		gPush();
			gRotate(extraLogAngles[i], 0, 1, 0);
			gRotate(90, 1, 0, 0);
			gTranslate(0, -0.14, 0);
			gScale(0.085, 0.085, extraLogLengths[i]);
			drawCylinder();
		gPop();
	}

	gPush();
		setColor(vec4(0.12, 0.11, 0.1, 1.0));
		gTranslate(0, 0, 0);
		gScale(0.62, 0.03, 0.62);
		drawSphere();
	gPop();

	setColor(vec4(0.45, 0.45, 0.45, 1.0));
	for (let i = 0; i < 26; i++) {
		let angle = i * (360.0 / 26.0);
		let rad = radians(angle);
		let rockRadius = 0.85 + 0.12 * Math.sin(i * 0.7);
		let rockY = -0.05 + 0.03 * Math.sin(i * 0.8);
		let sx = 0.18 + 0.1 * (0.5 + 0.5 * Math.sin(i * 2.73));
		let sy = 0.13 + 0.09 * (0.5 + 0.5 * Math.sin(i * 1.97 + 0.9));
		let sz = 0.17 + 0.1 * (0.5 + 0.5 * Math.sin(i * 3.41 + 1.7));

		gPush();
			gTranslate(rockRadius * Math.cos(rad), rockY, rockRadius * Math.sin(rad));
			gRotate(12.0 * Math.sin(i * 1.3), 0, 1, 0);
			gScale(sx, sy, sz);
			drawSphere();
		gPop();
	}

	let flameIntensity1 = 0.5 + 0.5 * Math.sin(TIME * 2.0);
	let flameIntensity2 = 0.5 + 0.5 * Math.sin(TIME * 2.25 + 1.0);
	let flameIntensity3 = 0.5 + 0.5 * Math.sin(TIME * 1.9 + 2.1);
	let flameIntensity4 = 0.5 + 0.5 * Math.sin(TIME * 2.5 + 0.4);
	let flameIntensity5 = 0.5 + 0.5 * Math.sin(TIME * 2.1 + 2.8);

	gPush();
		gTranslate(-0.22, 0.2, 0);
		setColor(vec4(1.0, 0.7, 0.0, flameIntensity1)); 
		gRotate(-90, 1, 0, 0); 
		gScale(0.14, 0.14, 1.0 * flameIntensity1 + 0.24);
		drawCone();
	gPop();

	gPush();
		gTranslate(0.22, 0.2, 0);
		setColor(vec4(1.0, 0.5, 0.0, flameIntensity2)); 
		gRotate(-90, 1, 0, 0);
		gScale(0.14, 0.14, 1.0 * flameIntensity2 + 0.24);
		drawCone();
	gPop();

	gPush();
		gTranslate(0, 0.3, 0);
		setColor(vec4(1.0, 0.8, 0.2, flameIntensity3)); 
		gRotate(-90, 1, 0, 0);
		gScale(0.18, 0.18, 1.3 * flameIntensity3 + 0.4);
		drawCone();
	gPop();

	gPush();
		gTranslate(0.0, 0.28, -0.18);
		setColor(vec4(1.0, 0.55, 0.05, flameIntensity4));
		gRotate(-90, 1, 0, 0);
		gScale(0.13, 0.13, 0.95 * flameIntensity4 + 0.2);
		drawCone();
	gPop();

	gPush();
		gTranslate(0.0, 0.25, 0.2);
		setColor(vec4(1.0, 0.65, 0.12, flameIntensity5));
		gRotate(-90, 1, 0, 0);
		gScale(0.13, 0.13, 0.95 * flameIntensity5 + 0.2);
		drawCone();
	gPop();

	for (let i = 0; i < 20; i++) {
		let angle = i * (360.0 / 20.0);
		let rad = radians(angle);
		let flameRadius = 0.36 + 0.04 * Math.sin(i * 0.9);
		let pulse = 0.45 + 0.55 * Math.sin(TIME * (2.0 + 0.1 * i) + i * 0.8);

		gPush();
			gTranslate(flameRadius * Math.cos(rad), 0.2 + 0.04 * Math.sin(TIME * 1.5 + i), flameRadius * Math.sin(rad));
			setColor(vec4(1.0, 0.45 + 0.05 * Math.sin(i), 0.02, pulse));
			gRotate(-90, 1, 0, 0);
			gScale(0.09, 0.09, 0.6 * pulse + 0.14);
			drawCone();
		gPop();
	}

	for (let i = 0; i < 14; i++) {
		let angle = i * (360.0 / 14.0) + 18.0;
		let rad = radians(angle);
		let pulse = 0.4 + 0.6 * Math.sin(TIME * (2.3 + 0.075 * i) + i * 1.1);

		gPush();
			gTranslate(0.24 * Math.cos(rad), 0.42 + 0.06 * Math.sin(TIME * 1.7 + i), 0.24 * Math.sin(rad));
			setColor(vec4(1.0, 0.62, 0.18, pulse));
			gRotate(-90, 1, 0, 0);
			gScale(0.08, 0.08, 0.52 * pulse + 0.14);
			drawCone();
		gPop();
	}
}


function drawCooler() {
	gPush();
		setColor(vec4(1.0, 1.0, 1.0, 1.0));
		gScale(0.6, 0.5, 0.8);
		drawCube();
	gPop();

	gPush();
		gTranslate(0, 0.5, 0);
		setColor(vec4(0.2, 0.45, 1.0, 1.0)); 
		gScale(0.65, 0.1, 0.85);
		drawCube();
	gPop();

	gPush();
		gTranslate(0, 0.6, 0);
		setColor(vec4(0.2, 0.2, 0.2, 1.0));
		gRotate(90, 0, 0, 1);
		gScale(0.15, 0.6, 0.15);
		drawCylinder();
	gPop();
}

function drawWavyGrassPatch(bladeCount, patchRadius, windPhase) {
	bladeCount = (bladeCount || 30) * 6;
	patchRadius = patchRadius || 0.9;
	windPhase = windPhase || 0.0;

	for (let i = 0; i < bladeCount; i++) {
		let baseSeed = i * 17.0 + windPhase * 101.0;
		let angle = randomFloatBetween(0.0, 360.0, baseSeed + 1.0);
		let radA = radians(angle);
		let radiusSample = randomFloatBetween(0.0, 1.0, baseSeed + 2.0);
		let radius = patchRadius * Math.sqrt(radiusSample);
		let px = radius * Math.cos(radA);
		let pz = radius * Math.sin(radA);
		let h = 0.2 + 0.18 * (0.5 + 0.5 * Math.sin(i * 1.37 + 0.7));
		let yaw = angle + 30.0 * Math.sin(i * 0.87);

		let swayA = Math.sin(TIME * 1.1 + windPhase + i * 0.6);
		let swayB = Math.sin(TIME * 1.5 + windPhase * 1.4 + i * 0.9);
		let swayC = Math.sin(TIME * 0.9 + windPhase * 0.8 + i * 0.4);
		let colorNoiseA = 0.5 + 0.5 * Math.sin(i * 2.31 + 0.8);
		let colorNoiseB = 0.5 + 0.5 * Math.sin(i * 3.17 + 2.2);
		let colorNoiseC = 0.5 + 0.5 * Math.sin(i * 1.57 + 1.1);

		gPush();
			gTranslate(px, 0, pz);
			gRotate(yaw, 0, 1, 0);

			gShear(0.45 * swayA, 0.0, 0.0, 0.0, 0.0, 0.0);
			gShear(0.28 * swayB, 0.0, 0.0, 0.0, 0.0, 0.0);
			gShear(0.0, 0.22 * swayC, 0.0, 0.0, 0.0, 0.0);

			setColor(vec4(
				0.14 + 0.12 * colorNoiseA,
				0.24 + 0.18 * colorNoiseB,
				0.04 + 0.05 * colorNoiseC,
				1.0
			));
			gScale(0.0022, h, 0.022);
			gTranslate(0, 1.0, 0);
			drawCube();
		gPop();

		gPush();
			gTranslate(px, 0, pz);
			gRotate(yaw + 90.0, 0, 1, 0);

			gShear(0.38 * swayA, 0.0, 0.0, 0.0, 0.0, 0.0);
			gShear(0.24 * swayB, 0.0, 0.0, 0.0, 0.0, 0.0);
			gShear(0.0, 0.18 * swayC, 0.0, 0.0, 0.0, 0.0);

			setColor(vec4(
				0.12 + 0.1 * colorNoiseC,
				0.2 + 0.16 * colorNoiseA,
				0.035 + 0.045 * colorNoiseB,
				1.0
			));
			gScale(0.002, h * 0.95, 0.02);
			gTranslate(0, 1.0, 0);
			drawCube();
		gPop();
	}
}


var triFan = null;

function initTriFan(segments) {
	segments = segments || 48;

	let pointsArray = [];
	let normalsArray = [];
	let texCoordsArray = [];

	pointsArray.push(vec4(0.0, 0.0, 0.0, 1.0));
	normalsArray.push(vec3(0.0, 0.0, 1.0));
	texCoordsArray.push(vec2(0.5, 0.5));


	for (let i = 0; i <= segments; i++) {
		let t = (2.0 * Math.PI * i) / segments;
		let x = Math.cos(t);
		let y = Math.sin(t);

		pointsArray.push(vec4(x, y, 0.0, 1.0));
		normalsArray.push(vec3(0.0, 0.0, 1.0));
		texCoordsArray.push(vec2(0.5 + 0.5 * x, 0.5 + 0.5 * y));
	}

	triFan = {
		count: pointsArray.length,
		vBuffer: gl.createBuffer(),
		nBuffer: gl.createBuffer(),
		tBuffer: gl.createBuffer(),
		vPosition: gl.getAttribLocation(program, "vPosition"),
		vNormal: gl.getAttribLocation(program, "vNormal"),
		vTexCoord: gl.getAttribLocation(program, "vTexCoord")
	};

	gl.bindBuffer(gl.ARRAY_BUFFER, triFan.vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, triFan.nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, triFan.tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
}

function drawTriFan() {
	if (!triFan) {
		initTriFan(64);
	}

	setMV();

	gl.bindBuffer(gl.ARRAY_BUFFER, triFan.nBuffer);
	gl.vertexAttribPointer(triFan.vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(triFan.vNormal);

	gl.bindBuffer(gl.ARRAY_BUFFER, triFan.vBuffer);
	gl.vertexAttribPointer(triFan.vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(triFan.vPosition);

	if (triFan.vTexCoord >= 0) {
		gl.bindBuffer(gl.ARRAY_BUFFER, triFan.tBuffer);
		gl.vertexAttribPointer(triFan.vTexCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(triFan.vTexCoord);
	}

	gl.drawArrays(gl.TRIANGLE_FAN, 0, triFan.count);
}

function drawBeachLog() {
	let logRadius = 0.38;
	let logLength = 2.2;
	let capOffset = (logLength * 0.5) + 0.003;

	gPush();
		useBark014Texture();
		gRotate(90, 0, 1, 0); // Lay cylinder along X axis
		gScale(logRadius, logRadius, logLength);
		drawCylinder();
	gPop();


	gPush();
		useTreeEnd004Texture();
		gTranslate(-capOffset, 0, 0);
		gRotate(-90, 0, 1, 0);
		gScale(logRadius * 0.5, logRadius * 0.5, 1.0);
		drawTriFan();
	gPop();

	gPush();
		useTreeEnd004Texture();
		gTranslate(capOffset, 0, 0);
		gRotate(90, 0, 1, 0);
		gScale(logRadius * 0.5, logRadius * 0.5, 1.0);
		drawTriFan();
	gPop();
}