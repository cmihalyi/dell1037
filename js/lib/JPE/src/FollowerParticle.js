JPE.declare('FollowerParticle', {
	
		constructor: function(follower, offsetX, offsetY, layer) {
			//console.log("Create FollowerParticle");
			this.follower = follower;
			this.offsetX = offsetX;
			this.offsetY = offsetY;
			this.curr = new JPE.Vector(0,0);

			this.layer = layer;

			// this.container = new createjs.Container();
			// layer.addChild(this.container);

			this.ignorePainting = true;
			this.ignoreInternalCollisions = true;

			this.cssImages = new Array();
		},

		initSelf: function() {

		},

		getCollidable: function(){
			return null;
		},

		cleanup: function() {

		},

		getCenter: function() {
			return this.follower.getCenter();
		},

		addCssImage: function(img, offsetX, offsetY, width, height) {
			//console.log("CSS - AddImage - FollowerParticle - " + img + ", " + offsetX + ", " + offsetY);
			var img = new CssImage(img, width, height, offsetX, offsetY);
			this.cssImages.push(img);
			$(img.domElement).appendTo($(this.layer.domElement));
		},

		removeAllCssImages: function(){
			for( var i = 0; i < this.cssImages.length; i++ )
			{
				$(this.cssImages[i].domElement).remove();
			}
		},

		// Add an image to the container that this follower has and move the container.
		addImage: function(img, offsetX, offsetY) {
			//console.log("AddImage - FollowerParticle - " + img + ", " + offsetX + ", " + offsetY);
			var bitmap = new createjs.Bitmap(img);
			bitmap.x = offsetX;
			bitmap.y = offsetY;
			this.container.addChild(bitmap);
		},

		update: function(dt2) {
			// console.log("FollowerParticle - Update");
			// this.container.x = this.follower.getCenter().x + this.offsetX;
			// this.container.y = this.follower.getCenter().y + this.offsetY;
			// this.container.rotation = this.follower.getAngle() - 180;
			this.layer.x = this.follower.getCenter().x + this.offsetX;
			this.layer.y = this.follower.getCenter().y + this.offsetY;
			this.layer.rotation = this.follower.getAngle() - 180;
			// console.log("Rotation Update: " + this.layer.rotation);
		}
});