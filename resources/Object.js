

var Transform = function(x,y,z,width,height, scalar, gl){
	this.gl=gl;
	
	
	
	
	this.program = 	initShaders( gl, "vertex-shader", "fragment-shader" );
	
	this.matrix =   [x,0,0,0
					 0,y,0,0
					 0,0,z,0
					 0,0,0,scalar];
					 
	var verticies = [
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
			0,0,1, 	1,0,1,	1,0,0];
			
	var bufferId = this.gl.createBuffer();
	this.gl.bindBuffer( this.gl.ARRAY_BUFFER, bufferId );
	this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(vertices), this.gl.STATIC_DRAW );
	
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
	
	this.Translate = function(x,y,z){
		var tmat = translate(x,y,z);
		matrix = mult(matrix,tmat);
	}
	
	
	this.draw = function(){
		gl.useProgram( this.program );
		var position = this.gl.getUniformLocation(this.program,"Position");
		this.gl.uniformMatrix4fv(position,false,this.matrix);
		
	}
}