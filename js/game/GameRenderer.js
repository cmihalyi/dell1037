(function (window) {
	function GameRenderer(canvasName) {
		console.log("GameRenderer Constructor");
		this.stage = new createjs.Stage(document.getElementById(canvasName));
	};

	GameRenderer.prototype.createLayer = function(name) {
		var c = new createjs.Container();
		c.name = name;
		this.stage.addChild(c);
		return c;
	};

	GameRenderer.prototype.render = function() {
		this.stage.update();
	};

	window.GameRenderer = GameRenderer;

} (window));