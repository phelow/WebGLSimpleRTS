Rigidbody = function (mass, friction) {
    //this.m_transform;
    this.m_mass = mass;
    this.m_friction = friction;
    this.delta = [0, 0, 0];
    this.m_angularVelocity = [0, 0, 0];
	this.Name="Rigidbody";
    this.addRotationalForce = function (rotationalForce) {
		Transform.checkNull(rotationalForce);
        this.m_angularVelocity[0] += rotationalForce[0] / mass;
        this.m_angularVelocity[1] += rotationalForce[1] / mass;
        this.m_angularVelocity[2] += rotationalForce[2] / mass;
    }

    this.addForce = function (xForce, yForce, zForce) { //TODO: use vector addition instead of passing in three values
		if(isNaN(xForce)||isNaN(yForce)||isNaN(zForce)){
			console.error("NaN is not a valid input.")
		};
        this.delta[0] += xForce / mass;
        this.delta[1] += yForce / mass;
        this.delta[2] += zForce / mass;
    }

	this.Start = function(){
		this.m_transform = this.GameObject.getComponent("Transform");
	}
	
    this.Update = function () {
        this.m_transform.rotate(this.m_angularVelocity);
		//console.log(this.m_transform);
        this.m_transform.translate(this.delta);
        this.delta[0] *= friction;
        this.delta[1] *= friction;
        this.delta[2] *= friction;
    }

}