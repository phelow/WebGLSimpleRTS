var allUnits = [];

Unit = function(transform, faction){
	this.m_transform = transform;
	this.m_faction = faction;
	this.m_rigidbody = Rigidbody(this.m_transform,1,.99);
	this.m_target = null;
	
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
				else if(getDistance(this.m_target, this.m_transform) < getDistance(potentialTarget,this.m_transform)){
					this.m_target = potentialTarget;
				}
			}
		}
		
	}
}