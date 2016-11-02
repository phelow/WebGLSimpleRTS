var allUnits = [];

Unit = function(transform, faction){
	this.m_transform = transform;
	this.m_faction = faction;
	this.m_rigidbody = Rigidbody(this.m_transform,1,.99);
	this.m_target = null;
	
	this.simpleAI = function(){
		//TODO: implement basic following ai
	}
}