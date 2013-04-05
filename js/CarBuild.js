(function(window){
	function CarBuild(){
//		console.log("CarBuild Constructor");
		this.reset();
	};

	CarBuild.prototype.setBaseCarStats = function(buildConfig) {
		this.chassis = buildConfig.compatibleChassis[0];
		this.wheels = buildConfig.compatibleWheels[0];
		this.brakes = buildConfig.compatibleBrakes[0];

		this.repair_cost = buildConfig.repair_cost;

//		console.log(this);
	};

	CarBuild.prototype.setChassis = function(chassis) {
		this.chassis = chassis;
//		console.log(this);
	};

	CarBuild.prototype.setWheels = function(wheels) {
		this.wheels = wheels;
//		console.log(this);
	};

	CarBuild.prototype.setBrakes = function(brakes) {
		this.brakes = brakes;
//		console.log(this);
	};

	CarBuild.prototype.addSpoiler = function() {
		//console.log('CarBuild -- addSpoiler()');
		this.spoiler = true;
	};

	CarBuild.prototype.removeSpoiler = function() {
		//console.log('CarBuild -- addSpoiler()');
		this.spoiler = false;
	};

	CarBuild.prototype.addShocks = function() {
		//console.log('CarBuild -- addShocks()');
		this.shocks = true;
	};

	CarBuild.prototype.removeShocks = function() {
		//console.log('CarBuild -- addShocks()');
		this.shocks = false;
	};

	CarBuild.prototype.addRollBar = function() {
		//console.log('CarBuild -- addRollBar');f
		this.roll_bar = true;
	};

	CarBuild.prototype.removeRollBar = function() {
		//console.log('CarBuild -- addRollBar');f
		this.roll_bar = false;
	};

	CarBuild.prototype.reset = function() {
		this.chassis = null;
		this.wheels = null;
		this.brakes = null;
		this.spoiler = false;
		this.shocks = false;
		this.roll_bar = false;

		this.spoilerLeadGen = '';
		this.shocksLeadGen = '';
		this.roll_barLeadGen = '';

		this.repair_cost = null;

		this.buildPathName = null;
	};

	CarBuild.prototype.resetMods = function (){
//		console.log('reset mods');
		this.spoiler = false;
		this.shocks = false;
		this.roll_bar = false;
	};

	CarBuild.prototype.getOverallAttrs = function(parts) {
		var preAvgAttrs = new Array();

		// Pre Averaged Attributes -- { 0 : overall speed, 1 : overall durability, 2 : overall handling, 3 : overall braking }
		/*preAvgAttrs[0] = parts.chassis[this.chassis-1].speed + parts.wheels[this.wheels-1].speed + parts.brakes[this.brakes-1].speed;
		preAvgAttrs[3] = parts.chassis[this.chassis-1].durability + parts.wheels[this.wheels-1].durability + parts.brakes[this.brakes-1].durability;
		preAvgAttrs[2] = parts.chassis[this.chassis-1].handling + parts.wheels[this.wheels-1].handling + parts.brakes[this.brakes-1].handling;
		preAvgAttrs[1] = parts.chassis[this.chassis-1].braking + parts.wheels[this.wheels-1].braking + parts.brakes[this.brakes-1].braking;*/

		// @TODO: Have to initialize values because of logic below this, find out a better way
		for( var i = 0; i < 4; i++ )
			preAvgAttrs[i] = 0;
		
		if(this.chassis != null)
		{
			preAvgAttrs[0] += parts.chassis[this.chassis-1].speed;
			preAvgAttrs[1] += parts.chassis[this.chassis-1].braking;
			preAvgAttrs[2] += parts.chassis[this.chassis-1].handling;
			preAvgAttrs[3] += parts.chassis[this.chassis-1].durability;
		}
		if(this.wheels != null )
		{
			preAvgAttrs[0] += parts.wheels[this.wheels-1].speed;
			preAvgAttrs[1] += parts.wheels[this.wheels-1].braking;
			preAvgAttrs[2] += parts.wheels[this.wheels-1].handling;
			preAvgAttrs[3] += parts.wheels[this.wheels-1].durability;
		}
		if(this.brakes != null )
		{
			preAvgAttrs[0] += parts.brakes[this.brakes-1].speed;
			preAvgAttrs[1] += parts.brakes[this.brakes-1].braking;
			preAvgAttrs[2] += parts.brakes[this.brakes-1].handling;
			preAvgAttrs[3] += parts.brakes[this.brakes-1].durability;
		}

		if( this.spoiler )
		{
			preAvgAttrs[0] += parts.spoiler.speed;
			preAvgAttrs[3] += parts.spoiler.durability;
			preAvgAttrs[2] += parts.spoiler.handling;
			preAvgAttrs[1] += parts.spoiler.braking;
		}
		if( this.shocks )
		{
			preAvgAttrs[0] += parts.shocks.speed;
			preAvgAttrs[3] += parts.shocks.durability;
			preAvgAttrs[2] += parts.shocks.handling;
			preAvgAttrs[1] += parts.shocks.braking;
		}
		if( this.roll_bar )
		{
			preAvgAttrs[0] += parts.roll_bar.speed;
			preAvgAttrs[3] += parts.roll_bar.durability;
			preAvgAttrs[2] += parts.roll_bar.handling;
			preAvgAttrs[1] += parts.roll_bar.braking;
		}

		// clamp values to 10
		for( var j = 0; j < 4; j++ )
		{
			if( preAvgAttrs[j] > 10 )
				preAvgAttrs[j] = 10;
		}

//		console.log(preAvgAttrs);

		return preAvgAttrs;
	};

	CarBuild.prototype.calculateWorldProps = function (wPropsTable,parts) {
//		console.log('CarBuild -- calculateWorldProps()');

		var preAvgAttrs = this.getOverallAttrs(parts);

		var finalWorldProps = new WorldPropertiesObject();

		// constants
		finalWorldProps.car_mass = wPropsTable.car_mass[0];
		finalWorldProps.car_elasticity = wPropsTable.car_elasticity[0];
		finalWorldProps.car_friction = wPropsTable.car_friction[0];
		finalWorldProps.world_gravity = wPropsTable.world_gravity[0];
		finalWorldProps.car_brake_amount.x = wPropsTable.car_brake_amount[0].x;
		finalWorldProps.car_brake_amount.y = wPropsTable.car_brake_amount[0].y;

		// dynamics
		finalWorldProps.car_max_speed = wPropsTable.car_max_speed[preAvgAttrs[0]-1];
		finalWorldProps.car_brake_interval = wPropsTable.car_brake_interval[preAvgAttrs[1]-1];
		finalWorldProps.car_traction = wPropsTable.car_traction[preAvgAttrs[2]-1];
		finalWorldProps.car_durability = wPropsTable.car_durability[preAvgAttrs[3]-1];

		/*var attrLength = preAvgAttrs.length;

		for( var i = 0; i < attrLength; i++ )
		{
			if( preAvgAttrs[i] != 0 )
			{
				finalWorldProps.car_brake_amount.x += wPropsTable.car_brake_amount[preAvgAttrs[i]-1].x;
				finalWorldProps.car_brake_amount.y += wPropsTable.car_brake_amount[preAvgAttrs[i]-1].y;
				finalWorldProps.car_brake_interval += wPropsTable.car_brake_interval[preAvgAttrs[i]-1];
				finalWorldProps.car_mass += wPropsTable.car_mass[preAvgAttrs[i]-1];
				finalWorldProps.car_elasticity += wPropsTable.car_elasticity[preAvgAttrs[i]-1];
				finalWorldProps.car_friction += wPropsTable.car_friction[preAvgAttrs[i]-1];
				finalWorldProps.car_traction += wPropsTable.car_traction[preAvgAttrs[i]-1];
				finalWorldProps.car_max_speed += wPropsTable.car_max_speed[preAvgAttrs[i]-1];
				finalWorldProps.world_gravity += wPropsTable.world_gravity[preAvgAttrs[i]-1];
			}	
		}

		finalWorldProps.car_brake_amount.x /= attrLength;
		finalWorldProps.car_brake_amount.y /= attrLength;
		finalWorldProps.car_brake_interval /= attrLength;
		finalWorldProps.car_mass /= attrLength;
		finalWorldProps.car_elasticity /= attrLength;
		finalWorldProps.car_friction /= attrLength;
		finalWorldProps.car_traction /= attrLength;
		finalWorldProps.car_max_speed /= attrLength;
		finalWorldProps.world_gravity /= attrLength;*/

//		console.log(finalWorldProps);

		return finalWorldProps;
	};

	window.CarBuild = CarBuild;
}(window));