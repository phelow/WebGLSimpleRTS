Rigidbody = function(transform,mass,friction){
	this.m_transform = transform;
	this.m_mass = mass;
	this.m_friction = friction;
	this.delta = [0,0,0];
	
	this.addForce = function(xForce,yForce,zForce){ //TODO: use vector addition instead of passing in three values
		this.delta[0] += xForce/mass;
		this.delta[1] += yForce/mass;
		this.delta[2] += zForce/mass;
	}
	
	this.update = function(){
		this.m_transform.translate(this.delta);
		this.delta[0] *= friction;
		this.delta[1] *= friction;
		this.delta[2] *= friction;
	}
	
	this.draw = function(viewProjectionMatrix){
		this.m_transform.draw(viewProjectionMatrix);
	}
}