(function (window) {
	function Collectable(type, x, y, debug) {
		Collobsticle.apply(this, arguments);
		//console.log("Collectable Constructor - " + x + ' - ' + y + ' - ' + type);

	};

	Collectable.prototype = new Collobsticle();

	Collectable.prototype.debugDraw = function(x, y) {
		this.g = new Graphics();
		this.g.setStrokeStyle(1);
		this.g.beginStroke(Graphics.getRGB(0,0,0));
		var fillColor = new Object();
		fillColor.r = 0;
		fillColor.g = 255;
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

	Collectable.prototype.collision = function() {
		this.collided = true;
		this.disable();
		//console.log("Collectable Collected! - Amount: " + this.value);
		window.main.scoringSystem.addProfits(this.value);
	};

	window.Collectable = Collectable;

} (window));
