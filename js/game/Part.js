(function (window){
	function Part( type, speed, durability, handling, braking, cost ){
		this.type = type;
		this.speed = speed;
		this.durability = durability;
		this.handling = handling;
		this.braking = braking;
		this.cost = cost;		
	};

	window.Part = Part;
} (window));