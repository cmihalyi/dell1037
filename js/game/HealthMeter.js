(function (window) {
	function HealthMeter() {
		this.percentage = 100;
	};

	HealthMeter.prototype.initialize = function() {
//		console.log("HealtheMeter Constructor");
		this.base = $('<div />').attr( "class", "health-meter");
	};

	// Returns true if the user has no more health (0 or less), false otherwise.
	HealthMeter.prototype.subtractHealth = function() {
		this.percentage -= 100 / window.main.carWorldProps.car_durability;
		this.base.css({
			height : ( this.percentage * .78 )+ "%"
		});
		if ( this.percentage <= 0 )
		{
			return true;
		}
		return false;
	};

	HealthMeter.prototype.reset = function() {
		this.percentage = 100;
		this.base.css({
			height : ( this.percentage * .78 )+ "%"
		});
	};

	window.HealthMeter = HealthMeter;

}(window));