//Requires MV.js



function openFile(filename,func){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//load(this.responseText);
			//console.log(this.responsetext)
			func(this.responseText);
		}
	};
	xhttp.open("GET", "ncc1701b.data", true);
	xhttp.send();
}

var a = {
	fun : function(zzz){
		console.log(this.v);
	},
	v:10
}

function Instantiate(name,mat=mat4()){
	
}