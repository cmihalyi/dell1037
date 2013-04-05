(function (window) {

	function CarData(main) {
		this.main = main;

		this.speed = 0;
		this.braking = 0;
		this.handling = 0;
		this.durability = 0;
	
	};

	CarData.prototype.adjustSpeed = function(value) {
		this.speed += value;
	};

	CarData.prototype.adjustBraking = function(value) {
		this.braking += value;
	};

	CarData.prototype.adjustHandling = function(value) {
		this.handling += value;
	};

	CarData.prototype.adjustDurability = function(value) {
		this.durability += value;
	};

	window.CarData = CarData;

} (window));