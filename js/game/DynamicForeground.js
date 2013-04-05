(function (window) {
	function DynamicForeground(layer, root) {
//		console.log("DynamicForeground Constructor");
		this.layer = layer;
		this.root = root;
		for ( var i = 0; i < 2; i++ )
		{
			for ( var j = 0; j < 2; j++ )
			{
				this.root.imageResources.foregroundImages[i][j].enabled = true;
				this.layer.addImageAtXY(this.root.imageResources.foregroundImages[i][j], 1000, 1000, j*1000, i*1000, j + '-' + i );
			}
		}
	};

	DynamicForeground.prototype.convert = function(carX, carY) 
	{
		var obj = new Object();
		obj.x = Math.floor((carX/1000));
		obj.y = Math.floor((carY/1000));
		return obj;
	}

	DynamicForeground.prototype.update = function(carX, carY)
	{
		var instance = this;

		var loc = this.convert(carX, carY);
		// show art as needed
		var right = this.root.imageResources.foregroundImages[loc.y][loc.x+1];
		var corner = this.root.imageResources.foregroundImages[loc.y+1][loc.x+1];
		var below = this.root.imageResources.foregroundImages[loc.y+1][loc.x];

		var center = this.root.imageResources.foregroundImages[loc.y][loc.x];

		var viewLoc = this.convert(this.root.viewPortRect.x, this.root.viewPortRect.y );

		this.activateCollobstacles( this.root.collobstacles[loc.y][loc.x] );
		this.activateCollobstacles( this.root.collobstacles[loc.y][loc.x+1] );
		this.activateCollobstacles( this.root.collobstacles[loc.y+1][loc.x+1] );
		this.activateCollobstacles( this.root.collobstacles[loc.y+1][loc.x] );

		if ( !center.enabled )
		{
			center.enabled = true;
			this.layer.reAttachImage(center);
		}
		if ( !right.enabled )
		{
			right.enabled = true;
			this.layer.addImageAtXY(right, 1000, 1000, (loc.x+1)*1000, (loc.y)*1000, (loc.x+1) + '-' + (loc.y) );
		}
		if ( !corner.enabled )
		{
			corner.enabled = true;
			this.layer.addImageAtXY(corner, 1000, 1000, (loc.x+1)*1000, (loc.y+1)*1000, (loc.x+1) + '-' + (loc.y+1) );
		}
		if ( !below.enabled )
		{
			below.enabled = true;
			this.layer.addImageAtXY(below, 1000, 1000, (loc.x)*1000, (loc.y+1)*1000, (loc.x) + '-' + (loc.y+1) );
		}

		// hide art as needed @TODO
		var above = null;
		var aboveCorner = null;
		var left = null; 

		if ( loc.y - 2 >= 0 )
		{
			above = this.root.imageResources.foregroundImages[loc.y-2][loc.x];

			if ( loc.x - 2 >= 0 )
			{
				aboveCorner = this.root.imageResources.foregroundImages[loc.y-2][loc.x-2];
			}
		}
		if ( loc.x - 2 >= 0 )
		{
			left = this.root.imageResources.foregroundImages[loc.y][loc.x-2];
		}

		if ( above != null && above.enabled )
		{
			above.enabled = false;
			this.layer.removeImage(above);
			this.deactivateCollobstacles( this.root.collobstacles[loc.y-2][loc.x] );

			//console.log('above');
			//console.log('Y: ' + (loc.y-1)+ ', X: ' + loc.x );
			//console.log(above);
			//console.log(loc);
		}
		if ( aboveCorner != null && aboveCorner.enabled )
		{
			aboveCorner.enabled = false;
			this.layer.removeImage(aboveCorner);
			this.deactivateCollobstacles( this.root.collobstacles[loc.y-2][loc.x-2] );

			//console.log('abovecorner');
			//console.log('Y: ' + (loc.y-1)+ ', X: ' + (loc.x-1));
			//console.log(aboveCorner);
			//console.log(loc);
		}
		if ( left != null && left.enabled )
		{
			left.enabled = false;
			this.layer.removeImage(left);
			this.deactivateCollobstacles( this.root.collobstacles[loc.y][loc.x-2] );

			//console.log('left');
			//console.log('Y: ' + (loc.y)+ ', X: ' + (loc.x-1) );
			//console.log(left);
			//console.log(loc);
		}
	};

	DynamicForeground.prototype.activateCollobstacles = function( collobstacles ) {
		var instance = this;

		for( var i = 0; i < collobstacles.collection.length; i++ )
		{
			if( !collobstacles.collection[i].visible && collobstacles.collection[i].enabled )
			{
				if( this.root.viewPortRect.contains( collobstacles.collection[i].x, collobstacles.collection[i].y ) )
				{
					collobstacles.collection[i].visible = true;
					$(collobstacles.collection[i].domAnimation.domElement).appendTo($(instance.root.renderer.getLayer('collobstacles').domElement));
					//console.log('collobstacles activate');
				}
			}
		}
		collobstacles.checkCollision(this.root.renderer.getLayer('car').x, this.root.renderer.getLayer('car').y);
		collobstacles.render(this.root.viewPortRect, this.root.tickCount);
	};

	DynamicForeground.prototype.deactivateCollobstacles = function( collobstacles ) {
		var instance = this;

		for( var i = 0; i < collobstacles.collection.length; i++ )
		{
			if( collobstacles.collection[i].visible && collobstacles.collection[i].enabled )
			{
				collobstacles.collection[i].visible = false;
				$(collobstacles.collection[i].domAnimation.domElement).detach();
				//console.log('collobstacles deactivate');
			} 
		}
	};

	window.DynamicForeground = DynamicForeground;

} (window));