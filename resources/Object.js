Array.prototype.x = function(){return this[0];}
Array.prototype.y = function(){return this[1];}
Array.prototype.z = function(){return this[2];}
Transform = function (gl, x, y, z) {
    this.program = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);;
    this.buffer = createFlattenedVertices(gl, primitives.createCubeVertices(20));;
    this.uniforms = {};
    this.uniforms.u_matrix = m4.identity();/*[x,0,0,0,
								0,y,0,0,
								0,0,z,0,
								0,0,0,1];*/
	
    this.pos = [x, y, z];
	Transform.checkNull(this.pos);
    this.rot = [0, 0, 0];
    this.sc = [1, 1, 1];
    this.gl = gl;
	this.Name = "Transform";
    this.Update = function (cameraMatrix) {
        this.uniforms.u_matrix = computeMatrix(cameraMatrix, this.pos, this.rot, this.sc);

        gl.useProgram(this.program.program);

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(gl, this.program, this.buffer);

        // Set the uniforms.
        webglUtils.setUniforms(this.program, this.uniforms);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, this.buffer.numElements);
    }


    //PUBLIC FUNCTIONS START HERE:

    this.scale = function (s) {
        if (s.length != 3) {
            console.warn("Error, scale argument should have length 3.");
        }
		Transform.checkNull(s);
        for (var i = 0; i < this.sc.length; i++) {
            this.sc[i] *= s[i];
        }
    }

    this.rotate = function (s) {
        if (s.length != 3) {
            console.warn("Error, rotation argument should have length 3.");
        }
		Transform.checkNull(s);
        for (var i = 0; i < this.rot.length; i++) {
            this.rot[i] += s[i];
        }
    }
    this.setPosition = function (s) {
        if (s.length != 3) {
            console.warn("Error, translation argument should have length 3.");
        }
		Transform.checkNull(s);
        for (var i = 0; i < this.pos.length; i++) {
            this.pos[i] = s[i];
        }
    }
    this.translate = function (s) {
        if (s.length != 3) {
            console.warn("Error, translation argument should have length 3.");
        }
		Transform.checkNull(s);
        for (var i = 0; i < this.pos.length; i++) {
            this.pos[i] += s[i];
        }
		
    }
}

Transform.clone = function(template){
	var temp = new Transform(gl,template.pos.x(),template.pos.y(),template.pos.z());
	temp.sc = template.sc.slice();//clone
	temp.rot = template.rot.slice();
	console.log(temp);
	return temp;
}

Transform.checkNull = function(vec){
	for(var i = 0; i < vec.length; i++){
		if(isNaN(vec[i])){
			console.error("NaN is not a valid input.");
			vec[i] = 0;
		}
	}
}
var vectorSubtract = function (vectorA, vectorB) {
    var vectorC = [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1], vectorA[2] - vectorB[2]];
    return vectorC;
}

var createFlattenedVertices = function (gl, vertices) {
    return webglUtils.createBufferInfoFromArrays(
        gl,
        primitives.makeRandomVertexColors(
            primitives.deindexVertices(vertices),
            {
                vertsPerColor: 6,
                rand: function (ndx, channel) {
                    return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                }
            })
      );
};
/*
getDistance = function (transformA, transformB) {
    return Math.sqrt(Math.pow(transformA.pos[0] + transformB.pos[0], 2) + Math.pow(transformA.pos[1] + transformB.pos[1], 2) + Math.pow(transformA.pos[2] + transformB.pos[2], 2))
}
*/
getDistance = function (transformA, transformB) {
    return Math.sqrt(Math.pow(transformA.pos[0] + transformB.pos[0], 2) + Math.pow(transformA.pos[1] + transformB.pos[1], 2));
}

function computeMatrix(viewProjectionMatrix, translation, rotation, scale) {
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2])
    matrix = m4.xRotate(matrix, rotation[0]);
    return m4.zRotate(m4.yRotate(matrix, rotation[1]), rotation[2]);
}
