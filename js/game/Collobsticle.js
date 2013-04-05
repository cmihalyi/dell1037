(function (window) {
	function Collobsticle(type, x, y, debug) {
		//console.log("Collobsticle Constructor:");
		this.type = type;
		this.x = x || 0;
		this.y = y || 0;
		this.debug = debug || false;
		this.animating = false;
		this.img = null;
		this.bmpAnim;

		this.domAnimation;
		this.collided = false;
		this.enabled = true;
		this.visible = false;

		this.Y_OFFSET = 8;
	};

	Collobsticle.prototype.addProperties = function(value, height, width, imgType) {
		this.value = parseInt(value);
		this.height = parseInt(height);
		this.width = parseInt(width);
		this.imgType = imgType;
	};

	Collobsticle.prototype.addValue = function(value) {
		this.value = parseInt(value);
	};

	Collobsticle.prototype.collision = function() {
		console.log("Collobsticle Collision - Should be overridden!");
	};

	// Collobsticle.prototype.loadImage = function(imgType, width, height, layer, imgSrcLoc) {
	Collobsticle.prototype.loadImage = function(img, width, height, layer) {
		//console.log("Collobsticle - loadImage - " + img);
		this.width = parseInt(width);
		this.height = parseInt(height);
		this.img = img;
		this.domAnimation = new CssAnimation(img, this.width, this.height);
		this.domAnimation.x = this.x;
		this.domAnimation.y = this.y + this.Y_OFFSET;

		// var instance = this;
		// var spriteSheet = new createjs.SpriteSheet({
		//     // image to use
		//     images: [instance.img], 
		//     // width, height & registration point of each sprite
		//     frames: {width: instance.width, height: instance.height}, 
		//     animations: {	
		// 	    animate: [0, 8, "animate", 4]
		//     }
	 //    });
		// var bmpAnim = new createjs.BitmapAnimation(spriteSheet);
		// bmpAnim.currentFrame = 0;
		// bmpAnim.x = this.x;
		// bmpAnim.y = this.y;
		// bmpAnim.gotoAndPlay("animate");
		// layer.addChild(bmpAnim);
	};

	Collobsticle.prototype.disable = function() {
		this.enabled = false;
		this.domAnimation.disable();
	};

	Collobsticle.prototype.setLocation = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Collobsticle.prototype.render = function() {
		if ( this.enabled )
		{
			if ( this.debug )
			{
				return this.debugDraw(this.x, this.y);
			}
			else
			{
				this.domAnimation.update();
				// if( !this.animating )
				// {
				// 	this.animating = true;
				// 	console.log("Animate Collobsticle");
				// 	this.bmpAnim.gotoAndPlay("rotate");
				// 	return;
				// }
				// return null;
			}
		}
	};

	Collobsticle.prototype.debugDraw = function(x, y) {
		this.g = new Graphics();
		this.g.setStrokeStyle(1);
		this.g.beginStroke(Graphics.getRGB(0,0,0));
		var fillColor = new Object();
		fillColor.r = 255;
		fillColor.g = 255;
		fillColor.b = 255;
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

	window.Collobsticle = Collobsticle;

} (window));