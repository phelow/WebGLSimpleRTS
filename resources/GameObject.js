


/*
basic component:
{
	
	//YOU MUST SUPPLY IN YOUR CONSTRUCTOR:
	Name:
	//Automatically set:
	Update:
	Start:
	GameObject:
	
}
*/
GameObjects = [];
GameObject = function () {
	this.components = [];
	this.Update = function(cameraMatrix){
		if(!this.started){
			this.started = true;
			this.Start();
		}
		for(var i = 0; i < this.components.length; i++){
			if("Update" in this.components[i]){
				this.components[i].Update(cameraMatrix);
			}
		}
	}
	this.id = GameObjects.length;
	GameObjects.push(this);
	
	this.started = false;
	this.Start = function(){
		for(var i = 0; i < this.components.length; i++){
			if("Start" in this.components[i]){
				this.components[i].Start();
			}
		}
	}
	
	
	this.addComponent = function(obj){
		if(!("Name" in obj)){
			console.warn("Component without a name added.");
		}
		this.components.push(obj);
		obj.GameObject = this;
	}
	this.addComponents = function(list){
		for(var i = 0; i < list.length; i++){	
			this.addComponent(list[i]);
		}
	}
	this.getComponent = function(name){
		for(var i = 0; i < this.components.length; i++){
			if("Name" in this.components[i] && name == this.components[i].Name){
				return this.components[i];
			}
		}
		return {};
	}
	
}

GameObject.Destroy = function(Obj){
	GameObjects.splice(GameObjects.findIndex((x)=>x===Obj),1);
}