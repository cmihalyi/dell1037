(function (window){
	function Part( type, speed, durability, handling, braking, cost ){
		this.type = parseInt(type);
		this.speed = parseInt(speed);
		this.durability = parseInt(durability);
		this.handling = parseInt(handling);
		this.braking = parseInt(braking);
		this.cost = parseInt(cost);		
	};

	window.Part = Part;
} (window));