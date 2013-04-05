(function (window){
	function WorldPropertiesTable(){
		//console.log("WorldPropertiesTable Constructor");
		
		this.car_brake_amount = new Array();
		this.car_brake_interval = new Array();
		this.car_mass = new Array();
		this.car_elasticity = new Array();
		this.car_durability = new Array();
		this.car_friction = new Array();
		this.car_traction = new Array();
		this.car_max_speed = new Array();
		this.world_gravity = new Array();
	};

	window.WorldPropertiesTable = WorldPropertiesTable;
}(window));