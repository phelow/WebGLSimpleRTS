Math.randomRange = function(min,max){
	return (Math.random() * (max-min) + min);
}

"use strict";

var cursor;
var obj;
var playerUnits;
var gl;

  function makeNewCursor(){
	cursor = new Rigidbody(new Transform(gl, 0,0,0),1,.99);
	cursor.m_transform.scale([.1,.1,.1,.1]);
	cursor.addRotationalForce([Math.randomRange(-.1,.1),Math.randomRange(-.1,.1),Math.randomRange(-.1,.1)]);
  }
function main() {
	//alert("Program starting");
	
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var textCanvas = document.getElementById("text");
  var ctx = textCanvas.getContext("2d");
  
  webglLessonsHelper.setupLesson(canvas);
  gl = canvas.getContext("webgl");
  if (!gl) {
    webglLessonsHelper.showNeedWebGL(canvas);
    return;
  }
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);
  var cameraHeight = 50;

  /*var sphereTranslation = [  0, 0, 0];
  var cubeTranslation   = [-40, 0, 0];
  var coneTranslation   = [ 40, 0, 0];
*/
  makeNewCursor();
  obj = [];
  
  enemyUnits = [];
	for(var i = 0; i < 10; i++){
		var enemyUnit = new Unit(new Rigidbody(new Transform(gl, 0,0,0),10000,.99),"enemy");
		enemyUnit.m_rigidbody.m_transform.scale([.2,.2,.2]);
		enemyUnits.push(enemyUnit);
		allUnits.push(enemyUnit);
	}

  playerUnits = [];
	for(var i = 0; i < 10; i++){
		obj.push(new Transform(gl, Math.randomRange(-30,30), Math.randomRange(-30,30),0));
		//console.log(Math.randomRange(-1,1));
		//obj.push(new Transform(gl, -1.5,1.5,0));
		obj[i].scale([.1,.1,.1]);
		
	}

  requestAnimationFrame(drawScene);
    document.onmousemove = handleMouseMove;
	document.onclick = handleMouseClick;

  // Draw the scene.
  function drawScene(time) {
    time *= 0.0005;
	
	//update the rigidbodies
	cursor.update();
	for(var i = 0; i < allUnits.length; i++){
		allUnits[i].simpleAI();
		allUnits[i].m_rigidbody.update();
	}
	
	cursor.m_transform.scale([1.01,1.01,1.01]);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    webglUtils.resizeCanvasToDisplaySize(ctx.canvas);
	
    // Clear the 2D canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.font = "20px serif";
	ctx.textAlign = "center";
	
	ctx.fillText("Tap or click to place a node.", canvas.width/2,canvas.height *7/8);


    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	this.viewport = [0, 0, gl.canvas.width, gl.canvas.height];
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    this.cameraPosition = [0, 0, 100];
    this.target = [0, 0, 0];
    this.up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(this.cameraPosition, this.target, this.up);

    // Make a view matrix from the camera matrix.
    this.viewMatrix = m4.inverse(cameraMatrix);

    this.viewProjectionMatrix = m4.multiply(projectionMatrix, this.viewMatrix);

    // ------ Draw the objects --------

	for(var i = 0; i < obj.length; i++){
		obj[i].draw(this.viewProjectionMatrix);
	}
	
	
	for(var i = 0; i < playerUnits.length; i++){
		playerUnits[i].m_rigidbody.m_transform.draw(this.viewProjectionMatrix);
	}
  
	cursor.m_transform.draw(this.viewProjectionMatrix);
    requestAnimationFrame(drawScene);
  }
  
  function unproject(windowX,windowY,windowZ, out){
	  windowX = parseFloat(windowX);
	  windowY = parseFloat(windowY);
	  windowZ = parseFloat(windowZ);
	  var model = this.viewMatrix;
	  var proj = this.viewProjectionMatrix;
	  var view = this.viewport;
	  var objPos = [];
	  var inp = [
		windowX,
		windowY,
		windowZ,
		1.0
	  ];
	  
	  var finalMatrix = [];
	  finalMatrix = multMatrices(model,proj,finalMatrix);
	  
	  finalMatrix = invertMatrix(finalMatrix,finalMatrix);
	  
	  
        inp[0] = (inp[0] - view[0]) / view[2];
        inp[1] = (inp[1] - view[1]) / view[3];
	  
	  
        inp[0] = inp[0] * 2 - 1;
        inp[1] = inp[1] * 2 - 1;
        inp[2] = inp[2] * 2 - 1;
		
		
        var out = [];
		
		out = multMatrixVec(finalMatrix, inp, out);
        if (out[3] === 0.0) {
            return out;
        }

        out[0] /= out[3];
        out[1] /= out[3];
        out[2] /= out[3];

        return out;
	  
  }
  
  function multMatrices (a, b, r) {
        for (var i = 0; i < 4; i = i + 1) {
            for (var j = 0; j < 4; j = j + 1) {
                r[i * 4 + j] =
                    a[i * 4 + 0] * b[0 * 4 + j] +
                    a[i * 4 + 1] * b[1 * 4 + j] +
                    a[i * 4 + 2] * b[2 * 4 + j] +
                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }
		
		return r;
    }
	
	function invertMatrix(m, invOut) {
        /** @type {Array.<number>} */
        var inv = [];

        inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
            m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
            m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
            m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
            m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
            m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
            m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
            m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
            m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
            m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
            m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
            m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
            m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

        /** @type {number} */
        var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

        det = 1.0 / det;

        for (var i = 0; i < 16; i = i + 1) {
            invOut[i] = inv[i] * det;
        }

        return invOut;
    }
	
	function multMatrixVec(matrix, inp, out) {
        for (var i = 0; i < 4; i = i + 1) {
            out[i] =
                inp[0] * matrix[0 * 4 + i] +
                inp[1] * matrix[1 * 4 + i] +
                inp[2] * matrix[2 * 4 + i] +
                inp[3] * matrix[3 * 4 + i];
        }
		
		return out;
    }
	
	function handleMouseMove(event) {
		var out = [0,0,0,0];
		out = unproject(event.clientX,event.clientY,-1,out);
		
		var out2 = [out[0]*out[2]-2.5,-out[1]*out[2]+5,1];
		//alert(out2);
  
		cursor.m_transform.setPosition(out2);
	}


	function handleMouseClick(event) {
		var newUnit = new Unit(cursor,"player");
		
		playerUnits.push(newUnit);
		makeNewCursor();
		
		allUnits.push(newUnit)
		
	}  
}

main();