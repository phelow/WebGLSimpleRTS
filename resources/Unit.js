var allUnits = [];

Unit = function (faction) {
    this.m_faction = faction;
    //this.m_rigidbody = rigidbody;
    this.m_target = null;//TYPE: Transform
    this.m_forceMultiplier = .001;
	this.Name ="Unit";
	this.Start = function(){
		this.m_rigidbody = this.GameObject.getComponent("Rigidbody");
		this.t = this.GameObject.getComponent("Transform");
		allUnits.push(this.GameObject);
	}
	this.TakeDamage = function (amount) {
	    this.t.sc = vectorSubtract(this.t.sc, [amount, amount, amount]);

	    if (this.t.sc[0] < 0) {
	        GameObjects.remove(this.GameObject);
	    }
	}

    this.Update = function () {
        //TODO: implement basic following ai
        //pick a target
        if (this.m_target == null) {
            for(var potentialTarget of allUnits) {
				var potentialUnit = potentialTarget.getComponent("Unit");
				//console.log(potentialUnit);
                if (potentialUnit.m_faction == this.m_faction) {
                    continue;
                }
                if (this.m_target == null) {
                    this.m_target = potentialTarget.getComponent("Transform");
                }
                else if (getDistance(this.m_target, this.t) < getDistance(potentialTarget.getComponent("Transform"), this.t)) {
                    this.m_target = potentialTarget;
                }
            }
        }
        if (this.m_target != null) { //TODO: fix the bug where we're getting a vector to the origin.
            var forceDir = vectorSubtract(this.m_target.pos, this.t.pos);
			
            forceDir = normalize(forceDir);
			if(isNaN(forceDir[0])){
				console.warn ("forceDir is nan");
				forceDir = [0,0,0];
			}
            distanceMultiplier = getDistance(this.m_target, this.t);
            forceDir = scale(distanceMultiplier,forceDir);
            forceDir = scale(this.m_forceMultiplier,forceDir );
            this.m_rigidbody.addForce(forceDir[0], forceDir[1], forceDir[2]);
        }
    }
}