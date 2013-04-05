(function (window) {
	function Obstacle(type, x, y, debug) {
		Collobsticle.apply(this, arguments);
		//console.log("Obstacle Constructor - " + x + ' - ' + y + ' - ' + type);
	};

	Obstacle.prototype = new Collobsticle();

	Obstacle.prototype.debugDraw = function(x, y) {
		this.g = new Graphics();
		this.g.setStrokeStyle(1);
		this.g.beginStroke(Graphics.getRGB(0,0,0));
		var fillColor = new Object();
		fillColor.r = 255;
		fillColor.g = 0;
		fillColor.b = 0;
		this.radius = 5;
		this.g.beginFill(Graphics.getRGB(fillColor.r, fillColor.g, fillColor.b));
		this.g.drawCircle(0,0,this.radius);
		this.s = new Shape(this.g);
		this.s.x = x;
		this.s.y = y;
		this.x = x;
		this.y = y;
		return this.s;
	};

	Obstacle.prototype.collision = function() {
		this.collided = true;
		this.disable();
//		console.log("Obstacle Ran In To! - Damage: " + 1);
		var racePage = window.main.pages[window.main.RACE_PAGE];
		if ( racePage.subtractHealth() )
		{
			var page = window.main.pages[window.main.RACE_PAGE];
			if ( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
			{
				racePage.race.oemRepairCar();
			}
			else
			{
				// does the user have enough money for repair?
				var amountLeft = window.main.scoringSystem.getRevenue() - racePage.race.gameProperties.repairCost;
				if ( amountLeft > 0 )
				{
					window.main.scoringSystem.addOperatingCosts(racePage.race.gameProperties.repairCost);
					racePage.race.repairCar();
				}
				else
				{
					racePage.race.gameOver();
				}
			}
		}
	};

	window.Obstacle = Obstacle;

} (window));