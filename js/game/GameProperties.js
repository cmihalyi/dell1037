(function (window) {
	function GameProperties() {
//		console.log("GameProperties Constructor");
		this.operatingCost = 0;
		this.operatingCostTick = 0;
		this.repairCost = 0;
		this.endLocation = new Object();
		this.endLocation.x = 0;
		this.endLocation.y = 0;
	};

	GameProperties.prototype.distributeContent = function(jsonFile) {
		this.operatingCost = parseInt(jsonFile.game_costs.amount);
		this.operatingCostTick = parseInt(jsonFile.game_costs.tick);
	};

	
	window.GameProperties = GameProperties;

} (window));