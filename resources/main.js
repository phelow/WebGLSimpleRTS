








Math.randomRange = function(min,max){
	return (Math.random() * (max-min) + min);
}

"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  webglLessonsHelper.setupLesson(canvas);
  var gl = canvas.getContext("webgl");
  if (!gl) {
    webglLessonsHelper.showNeedWebGL(canvas);
    return;
  }



  //var sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
  //var cubeBufferInfo   = createFlattenedVertices(gl, primitives.createCubeVertices(20));
  //var coneBufferInfo   = createFlattenedVertices(gl, primitives.createTruncatedConeVertices(10, 0, 20, 12, 1, true, false));

  // setup GLSL program
  

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
  var obj = [];
	for(var i = 0; i < 10; i++){
		obj.push(new Transform(gl, Math.randomRange(-30,30), Math.randomRange(-30,30),0));
		//console.log(Math.randomRange(-1,1));
		//obj.push(new Transform(gl, -1.5,1.5,0));
		obj[i].scale([.1,.1,.1]);
		
	}

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.0005;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // ------ Draw the objects --------

	for(var i = 0; i < obj.length; i++){
		obj[i].draw(viewProjectionMatrix);
	}
    requestAnimationFrame(drawScene);
  }
}

main();