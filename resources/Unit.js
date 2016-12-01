//var allUnits = [];

Unit = function (faction, GameObject) {
    this.m_faction = faction;
    //this.m_rigidbody = rigidbody;
    this.m_target = null;//TYPE: Transform
    this.GameObject = GameObject;
    this.m_targetGameObject = null;
    this.m_forceMultiplier = .001;
    this.Name = "Unit";
    this.dead = false;
	this.Start = function(){
		this.m_rigidbody = this.GameObject.getComponent("Rigidbody");
		this.t = this.GameObject.getComponent("Transform");
		//allUnits.push(this.GameObject);
	}
	this.TakeDamage = function (amount) {
	    amount = amount / 10;
	    console.log("19");
        
	    this.GameObject.getComponent("Transform").scale(vectorSubtract(this.GameObject.getComponent("Transform").sc, [amount, amount, amount]));
        
	    if (this.GameObject.getComponent("Transform").sc[0] < 1 || isNaN(this.GameObject.getComponent("Transform").sc[0])) {
	        console.log("DEAD: this.GameObject.getComponent(Transform).sc[0] :" + this.GameObject.getComponent("Transform").sc[0]);
	        var index = GameObjects.indexOf(this.GameObject);
	        if (index != -1)
	            GameObjects.splice(index, 1);
	        this.dead = true;
	    }
	    else {
	        console.log("this.GameObject.getComponent(Transform).sc[0] :" + this.GameObject.getComponent("Transform").sc[0] );
	    }

	}

    this.Update = function () {
        //TODO: implement basic following ai
        //pick a target

        if (this.m_targetGameObject != null && this.m_targetGameObject.dead == true) {
            this.m_target == null;
        }

        if (this.m_target == null) {
            for(var potentialTarget of GameObjects) {
                var potentialUnit = potentialTarget.getComponent("Unit");
                if (potentialUnit == null) {
                    continue;
                }

            //console.log(potentialUnit);
                if (potentialUnit.m_faction == this.m_faction) {
                    continue;
                }

                var potentialTransform = potentialTarget.getComponent("Transform");

                if (this.m_target == null || (potentialTransform.pos != null && this.m_target.pos != null && getDistance(this.m_target, this.t) < getDistance(potentialTransform, this.t))) {
                    this.m_target = potentialTransform;
                    this.m_targetGameObject = potentialUnit;
                }
            }

        }
        if (this.m_target != null && this.m_target.pos != null) { //TODO: fix the bug where we're getting a vector to the origin.
            console.log("Applying force");
            var forceDir = vectorSubtract(this.m_target.pos, this.t.pos);
            forceDir = normalize(forceDir);
            if (isNaN(forceDir[0])) {
                console.warn("forceDir is nan");
                forceDir = [0, 0, 0];
            }
            distanceMultiplier = getDistance(this.m_target, this.t);
            forceDir = scale(distanceMultiplier, forceDir);
            console.log("distance:" + distanceMultiplier);
            console.log(forceDir);
            forceDir = scale(this.m_forceMultiplier, forceDir);
            this.m_rigidbody.addForce(forceDir[0], forceDir[1], forceDir[2]);
        }
    }
}