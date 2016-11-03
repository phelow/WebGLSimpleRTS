

  var createFlattenedVertices = function(gl, vertices) {
    return webglUtils.createBufferInfoFromArrays(
        gl,
        primitives.makeRandomVertexColors(
            primitives.deindexVertices(vertices),
            {
              vertsPerColor: 6,
              rand: function(ndx, channel) {
                return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
              }
            })
      );
  };
  
  getDistance = function(transformA, transformB){
	  return Math.sqrt(Math.pow(transformA.pos[0] + transformB.pos[0],2) + Math.pow(transformA.pos[1] + transformB.pos[1],2) + Math.pow(transformA.pos[2] + transformB.pos[2],2))
  }


  function computeMatrix(viewProjectionMatrix, translation, rotation,scale) {
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
	matrix = m4.scale(matrix,scale[0],scale[1],scale[2])
    matrix = m4.xRotate(matrix, rotation[0]);
    return m4.zRotate(m4.yRotate(matrix, rotation[1]),rotation[2]);
  }

Transform = function(gl,x,y,z){
	this.program = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);;
	this.buffer = createFlattenedVertices(gl, primitives.createCubeVertices(20));; 
	this.uniforms = {};
	this.uniforms.u_matrix = m4.identity();/*[x,0,0,0,
								0,y,0,0,
								0,0,z,0,
								0,0,0,1];*/
								
	this.pos = [x,y,z];
	this.rot = [0,0,0];
	this.sc = [1,1,1];
	
	this.gl = gl;
	this.draw=function(cameraMatrix){
		this.uniforms.u_matrix = computeMatrix(cameraMatrix,this.pos,this.rot,this.sc);
		
		gl.useProgram(this.program.program);

      // Setup all the needed attributes.
      webglUtils.setBuffersAndAttributes(gl, this.program, this.buffer);

      // Set the uniforms.
      webglUtils.setUniforms(this.program, this.uniforms);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, this.buffer.numElements);
	}
	
	
	
	
	//PUBLIC FUNCTIONS START HERE:
	
	this.scale = function(s){
		if(s.length != 3){
			console.warn("Error, scale argument should have length 3.");
		}
		for(var i = 0; i < this.sc.length; i++){
			this.sc[i] *= s[i];
		}
	}
	
	this.rotate = function(s){
		if(s.length != 3){
			console.warn("Error, rotation argument should have length 3.");
		}
		for(var i = 0; i < this.rot.length; i++){
			this.rot[i] += s[i];
		}
	}
	this.setPosition = function(s){
		if(s.length != 3){
			console.warn("Error, translation argument should have length 3.");
		}
		for(var i = 0; i < this.pos.length; i++){
			this.pos[i] = s[i];
		}
	}
	this.translate = function(s){
		if(s.length != 3){
			console.warn("Error, translation argument should have length 3.");
		}
		for(var i = 0; i < this.pos.length; i++){
			this.pos[i] += s[i];
		}
	}
}
/*
Transform = function(x,y,z,width,height, scalar, gl){
	this.gl=gl;
	
	
	
	this.program = 	webglUtils.createProgramInfo(this.gl, ["vertex-shader", "fragment-shader"]);
	
	this.uniforms = {};
	this.uniforms.matrix =  	[1,0,0,x,
								0,1,0,y,
								0,0,1,z,
								0,0,0,scalar];
					 
	this.vertices = {position: {numComponents:1,data:[
			0,1,1,	1,1,1, 	1,1,0,
			0,1,1, 	0,1,0, 	1,1,0,
			0,1,1, 	0,1,0, 	0,0,1,
			0,1,1, 	0,1,0, 	0,0,0,
			1,1,0, 	0,1,0, 	0,0,0,
			1,1,0, 	1,0,0, 	0,0,0,
			1,1,0,	1,0,0, 	1,0,1,
			1,1,0, 	1,1,1,	1,0,1,
			1,1,0, 	0,0,1, 	1,0,1,
			0,1,1,	0,0,1, 	1,1,1,
			0,0,0, 	0,0,1, 	1,0,0,
			0,0,1, 	1,0,1,	1,0,0]}};
	//this.vertices.matrix == false;
	this.buffer = webglUtils.createBufferInfoFromArrays(gl,this.vertices);//this.gl.createBuffer();
	//console.log(this.buffer);
	//this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );
	//this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW );
	
	
	
	this.draw = function(){
		gl.useProgram(this.program.program);
		//console.log(this.gl,this.program,this.buffer)
		webglUtils.setBuffersAndAttributes(this.gl, this.program, this.buffer);
		webglUtils.setUniforms(this.program, this.uniforms);
		gl.drawArrays(gl.TRIANGLES, 0, this.buffer.numElements);
		//console.log("Drawing at " + this.matrix);
	}
	
	
	this.Translate = function(x,y,z){
		var tmat = translate(x,y,z);
		matrix = mult(matrix,tmat);
	}
	this.Rotate = function(x,y,z){
		var xmat = rotateAlongX(x);
		var ymat = rotateAlongY(y);
		var zmat = rotateAlongZ(z);
		
		var t = mult(xmat,ymat);
		var rotmat = mult(t,zmat);
		matrix = mult(matrix,rotmat);
	}
	
	this.Scale = function(x,y,z){
		var smat = scalem(x,y,z);
		matrix = mult(matrix,smat);
	}
	
	
	
}*/