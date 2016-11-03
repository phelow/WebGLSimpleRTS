var allUnits = [];

Unit = function(rigidbody, faction){
	this.m_faction = faction;
	this.m_rigidbody = rigidbody;
	this.m_target = null;
	console.log("unit created, rigidbody:" + this.m_rigidbody);
	
	this.simpleAI = function(){
		//TODO: implement basic following ai
		//pick a target
		if(this.m_target == null){
			for(var potentialTarget of allUnits){
				if(potentialTarget.m_faction == this.m_faction){
					continue;
				}
				
				if(this.m_target == null){
					this.m_target = potentialTarget;
				}
				else if(getDistance(this.m_target.m_rigidbody.m_transform, this.m_rigidbody.m_transform) < getDistance(potentialTarget.m_rigidbody.m_transform,this.m_rigidbody.m_transform)){
					this.m_target = potentialTarget;
				}
			}
		}
		if(this.m_target != null){
			console.log(this.m_target.m_rigidbody.m_transform.pos + " " +this.m_rigidbody.m_transform.pos);
			var forceDir = vectorSubtract(this.m_target.m_rigidbody.m_transform.pos,this.m_rigidbody.m_transform.pos);
			console.log(forceDir);
			this.m_rigidbody.addForce(forceDir[0],forceDir[1],forceDir[2]);
		}
	}
}