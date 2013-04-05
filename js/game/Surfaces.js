JPE.declare("Surfaces", {

	superclass: JPE.Group,

	constructor: function(colA, colB, colC, colD, colE){

		JPE.Surfaces.superclass.prototype.constructor.apply(this);

		var CircleParticle = JPE.CircleParticle,
			RectangleParticle = JPE.RectangleParticle,
			EdgeParticle = JPE.EdgeParticle;

		var instance = this;

		this.Y_OFFSET = 8;
		
	},

	loadLevel: function(data, layer) 
	{
		var newSegmentFlag = false;
		for ( var i = 1; i < data.length; i++ )
		{
			if ( !newSegmentFlag )
			{
				if ( data[i].x != "null" || data[i].y != "null" )
				{
					var ramp = new JPE.EdgeParticle(data[i-1].x, data[i-1].y + this.Y_OFFSET, data[i].x, data[i].y + this.Y_OFFSET, 16, true, 0, 0, .01);
					ramp.debugDraw = true;
					ramp.setStyle(0, 0x6699aa, 1, 0x6699aa);
					ramp.layer = layer;
		 			this.addParticle(ramp);
				} else {
					newSegmentFlag = true;
				}
			} else {
				newSegmentFlag = false;
			}
		}		
	},
});

//constructor: function(x, y, width, height, rotation, fixed, mass, elasticity, friction) {