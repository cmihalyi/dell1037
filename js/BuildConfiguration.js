(function(window){
	function BuildConfiguration(type,compatibleChassis,compatibleWheels,compatibleBrakes,repair_cost){
		this.type = type;

		this.compatibleChassis = new Array();
		this.compatibleWheels = new Array();
		this.compatibleBrakes = new Array();

		for( var i = 0; i < compatibleChassis.length; i++ )
		{
			this.compatibleChassis[i] = parseInt(compatibleChassis[i]);
		}
		for( var i = 0; i < compatibleWheels.length; i++ )
		{
			this.compatibleWheels[i] = parseInt(compatibleWheels[i]);
		}
		for( var i = 0; i < compatibleBrakes.length; i++ )
		{
			this.compatibleBrakes[i] = parseInt(compatibleBrakes[i]);
		}
		
		this.repair_cost = parseInt(repair_cost);

		Page.apply(this, arguments);
	};

	BuildConfiguration.prototype = new Page();

	BuildConfiguration.prototype.parent = Page.prototype;

	BuildConfiguration.prototype.getOverallAttrs = function(parts,index) {
		var preAvgAttrs = new Array();

		// Pre Averaged Attributes -- { 0 : overall speed, 1 : overall durability, 2 : overall handling, 3 : overall braking }
		/*preAvgAttrs[0] = parts.chassis[this.chassis-1].speed + parts.wheels[this.wheels-1].speed + parts.brakes[this.brakes-1].speed;
		preAvgAttrs[3] = parts.chassis[this.chassis-1].durability + parts.wheels[this.wheels-1].durability + parts.brakes[this.brakes-1].durability;
		preAvgAttrs[2] = parts.chassis[this.chassis-1].handling + parts.wheels[this.wheels-1].handling + parts.brakes[this.brakes-1].handling;
		preAvgAttrs[1] = parts.chassis[this.chassis-1].braking + parts.wheels[this.wheels-1].braking + parts.brakes[this.brakes-1].braking;*/

		// @TODO: Have to initialize values because of logic below this, find out a better way
		for( var i = 0; i < 4; i++ )
			preAvgAttrs[i] = 0;
		
		if(this.compatibleChassis != null)
		{
			preAvgAttrs[0] += parts.chassis[this.compatibleChassis[index]-1].speed;
			preAvgAttrs[1] += parts.chassis[this.compatibleChassis[index]-1].braking;
			preAvgAttrs[2] += parts.chassis[this.compatibleChassis[index]-1].handling;
			preAvgAttrs[3] += parts.chassis[this.compatibleChassis[index]-1].durability;
		}
		if(this.compatibleWheels != null )
		{
			preAvgAttrs[0] += parts.wheels[this.compatibleWheels[index]-1].speed;
			preAvgAttrs[1] += parts.wheels[this.compatibleWheels[index]-1].braking;
			preAvgAttrs[2] += parts.wheels[this.compatibleWheels[index]-1].handling;
			preAvgAttrs[3] += parts.wheels[this.compatibleWheels[index]-1].durability;
		}
		if(this.compatibleBrakes != null )
		{
			preAvgAttrs[0] += parts.brakes[this.compatibleWheels[index]-1].speed;
			preAvgAttrs[1] += parts.brakes[this.compatibleWheels[index]-1].braking;
			preAvgAttrs[2] += parts.brakes[this.compatibleWheels[index]-1].handling;
			preAvgAttrs[3] += parts.brakes[this.compatibleWheels[index]-1].durability;
		}

		for( var j = 0; j < 4; j++ )
		{
			if( preAvgAttrs[j] > 10 )
				preAvgAttrs[j] = 10;
			
		}

//		console.log(preAvgAttrs);

		return preAvgAttrs;
	};

	window.BuildConfiguration = BuildConfiguration;
}(window));