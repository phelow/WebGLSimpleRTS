Math.rad2deg = 180/Math.PI;
Math.deg2rad = Math.PI/180;

var LineRenderer = function(start,end,durationFrames){//vector2, vector2, int
	this.p1 = start;
	this.p2 = end;
	this.timeRemaining = durationFrames;//This is an int.
	this.Name = "LineRenderer";
	this.Start = function(){
		var transform = this.GameObject.getComponent("Transform");
		var distance = subtract(this.p1,this.p2);
		var point = add(start,end);
		point = [point.x()/2,point.y()/2,0];
		transform.pos = point;
		transform.rotate([0,0,LineRenderer.angle(this.p1,this.p2)]);
		transform.sc = [magnitude(distance),1,1];
	}
	this.Update = function(){
		this.timeRemaining--;
		if(this.timeRemaining <= 0){
			//DESTORY OBJECT
			GameObject.Destroy(this.GameObject);
			//this.GameObject.getComponent("Transform").scale([0,0,0]);
		}
	}
	
	
	

}


////STATIC FUNCTIONS:
LineRenderer.angle = function(start,end){
	var vector = subtract(start,end);
	var angle = Math.atan2(vector.y(),vector.x());
	//console.log(angle);
	return angle;
}

LineRenderer.Spawn = function(start,end,durationFrames){
	var go = new GameObject();
	go.addComponents([
		new Transform(gl,0,0,0),
		new LineRenderer(start,end,durationFrames)
	])	
}