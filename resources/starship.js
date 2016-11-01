var gl;
var points;
var program;
var normalMatrix, normalMatrixLoc;

window.onload = function init()
{
	thing();
};

function thing(){
	
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var inputVertices = [
	0,1,1, 1,1,1, 1,1,0,
	0,1,1, 0,1,0, 1,1,0,
	0,1,1, 0,1,0, 0,0,1,
	0,1,1, 0,1,0, 0,0,0,
	1,1,0, 0,1,0, 0,0,0,
	1,1,0, 1,0,0, 0,0,0,
	1,1,0, 1,0,0, 1,0,1,
	1,1,0, 1,1,1, 1,0,1,
	1,1,0, 0,0,1, 1,0,1,
	0,1,1, 0,0,1, 1,1,1,
	0,0,0, 0,0,1, 1,0,0,
	0,0,1, 1,0,1, 1,0,0,
    ];
	
	var vertices = [];
	var surfaceNormals = [];
	
	for(var i = 0; i < inputVertices.length; i = i + 9){
		var a = new vec3(inputVertices[i+0],inputVertices[i+1],inputVertices[i+2]);
		var b = new vec3(inputVertices[i+3],inputVertices[i+4],inputVertices[i+5]);
		var c = new vec3(inputVertices[i+6],inputVertices[i+7],inputVertices[i+8]);
		
		var vectorA = subtract(b,a);
		var vectorB = subtract(c,a);
		
		
        var normal = cross(vectorA,vectorB);
		
		normal[0] += .3;
		normal[1] += .3;
		normal[2] += .3;
		
        normal = normalize(normal);
        normal[3] =  0;
	
     	surfaceNormals.push(normal);
		surfaceNormals.push(normal);
		surfaceNormals.push(normal);//cross product of b-a and c-a
		
		//normalize vector
		
		vertices.push(a);
		vertices.push(b);
		vertices.push(c);
		
	}

	
	points = vertices.length;
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
	setRotation();
	
	
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(surfaceNormals), gl.STATIC_DRAW );
    
    var vNormals = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormals, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormals );
    
	
    render();
	
}

cross = function(a, b){ // [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1 ]
	var vec = new vec3(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]);
	return vec;
}
var matrix;
function setRotation(){
	
	
    var x = document.getElementById("xSlider").value * 360/100;
    var y = document.getElementById("ySlider").value * 360/100;
    var z = document.getElementById("zSlider").value * 360/100;
	
	
	matrix = [
		1, 0,  0,  0,
		0, 1,  0,  0,
		0,  0, 1,  0,
		0,  0,  0,  1,
	];
	
	matrix = multiplyMatrix(matrix, rotateAlongX(x));
	matrix = multiplyMatrix(matrix, rotateAlongY(y));
	matrix = multiplyMatrix(matrix, rotateAlongZ(z));	
    
	var rotation = gl.getUniformLocation( program, "rotationMatrix" );
	gl.uniformMatrix4fv(rotation, false, matrix);
	
    gl.vertexAttribPointer( rotation, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( rotation );
}

function rotateAll() {	
	setRotation();
	
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	render();

	// Set the matrix.
}

// returns a new matrix
multiplyMatrix = function(matrixA, matrixB) { 
    var result = [
		0, 0,  0,  0,
		0, 0,  0,  0,
		0,  0, 0,  0,
		0,  0,  0,  0];
		
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i*4+k] * matrixB[k*4+j];
            }
            result[i * 4 + j] = sum;
        }
    }
    return result; 
}

function rotateAlongX(angleInDegrees) {
	var angleInRadians = angleInDegrees * 0.0174533;
	
  var sine = Math.sin(angleInRadians);
  var cosine = Math.cos(angleInRadians);

  return [
    1, 	0, 		0, 0,
    0, 	cosine, sine, 0,
    0, 	-sine, 	cosine, 0,
    0, 	0, 		0, 1
  ];
};

function rotateAlongY(angleInDegrees) {
  var angleInRadians = angleInDegrees * 0.0174533;
  var sine = Math.sin(angleInRadians);
  var cosine = Math.cos(angleInRadians);

  return [
    cosine, 0, -sine, 0,
    0, 		1, 0, 0,
    sine, 	0, cosine, 0,
    0, 		0, 0, 1
  ];
};

function rotateAlongZ(angleInDegrees) {
  var angleInRadians = angleInDegrees * 0.0174533;
  var sine = Math.sin(angleInRadians);
  var cosine = Math.cos(angleInRadians);
  return [
     cosine, 	sine, 0, 0,
    -sine, 		cosine, 0, 0,
     0, 		0, 1, 0,
     0, 		0, 0, 1,
  ];
}


function render() {

	normalMatrix = [
		vec3(matrix[0], matrix[1], matrix[2]),
		vec3(matrix[3], matrix[4], matrix[5]),
		vec3(matrix[6], matrix[7], matrix[8])
	];
	
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points );
}