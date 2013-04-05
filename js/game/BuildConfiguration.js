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
	};

	BuildConfiguration.prototype.calculateFinalWorldProperties = function(){
	};

	window.BuildConfiguration = BuildConfiguration;
}(window));