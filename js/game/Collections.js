(function (window) {
	function Collections() {
		this.EXTRA_COLLISION_CHECK_SIZE_COLLECTABLE = 60;
		this.EXTRA_COLLISION_CHECK_SIZE_OBSTACLE = 40;
//		console.log("Collections Constructor");
		this.collection = new Array();
		// this.container = new createjs.Container();
	};

	Collections.prototype.push = function(item) {
		this.collection.push(item);
		// this.container.addChild(item.bmpAnim);
	};

	Collections.prototype.render = function( viewPortRect, tickCount ) {
		for ( var i = 0; i < this.collection.length; i++ )
		{
			if ( this.collection[i].enabled )
			{
				if ( this.collection[i].render != null && ( tickCount % 3 ) == 0 )
				{
					this.collection[i].render();
				}
			}
		}
	};

	Collections.prototype.checkCollision = function(xPos, yPos) {
		var width;
		var height;
		for ( var i = 0; i < this.collection.length; i++ )
		{
			if ( !this.collection[i].collided )
			{
				// console.log("CHECKING!");
				if( this.collection[i] instanceof window.Collectable )
				{
					width = this.collection[i].x + this.collection[i].width + this.EXTRA_COLLISION_CHECK_SIZE_COLLECTABLE;
				}
				else if( this.collection[i] instanceof window.Obstacle )
				{
					width = this.collection[i].x + this.collection[i].width + this.EXTRA_COLLISION_CHECK_SIZE_OBSTACLE;
				}
					
				if ( xPos >= this.collection[i].x && xPos <= width )
				{
					if( this.collection[i] instanceof window.Collectable)
					{
						height = this.collection[i].y + this.collection[i].height + this.EXTRA_COLLISION_CHECK_SIZE_COLLECTABLE;		
					}
					else if( this.collection[i] instanceof window.Obstacle )
					{
						height = this.collection[i].y + this.collection[i].height + this.EXTRA_COLLISION_CHECK_SIZE_OBSTACLE;
					}
					
					if ( yPos >= this.collection[i].y && yPos <= height )
					{
						// console.log("Car X: " + xPos + ", Car Y: " + yPos);
						//console.log("COLLISION! - " + this.collection[i].x + ", " + this.collection[i].y);
						this.collection[i].collision();

						if( this.collection[i] instanceof window.Collectable )
						{
							soundManager.play('coin_up', { multiShot : true } );
						}
					}
				}
			}
		}
	};

	window.Collections = Collections;

} (window));