(function(window){
	function WorldPropertiesObject(){
		this.car_brake_amount = new Object();
		this.car_brake_amount.x = null;
		this.car_brake_amount.y = null;
		this.car_brake_interval = null;
		this.car_mass = null;
		this.car_elasticity = null;
		this.car_friction = null;
		this.car_traction = null;
		this.car_max_speed = null;
		this.world_gravity = null;
		this.car_durability = null;
	};

	window.WorldPropertiesObject = WorldPropertiesObject;
}(window));