JPE.declare('EdgeParticle',  {

		superclass: JPE.RectangleParticle,

		/**
		 * @param x The initial x position.
		 * @param y The initial y position.
		 * @param height The height of this particle.
		 * @param fixed Determines if the particle is fixed or not. Fixed particles
		 * are not affected by forces or collisions and are good to use as surfaces.
		 * Non-fixed particles move freely in response to collision and forces.
		 * @param mass The mass of the particle
		 * @param elasticity The elasticity of the particle. Higher values mean more elasticity.
		 * @param friction The surface friction of the particle. 
		 * <p>
		 * Note that EdgeParticles can be fixed but still have their rotation property 
		 * changed.
		 * </p>
		 */
		constructor: function(pInitialX, pInitialY, pEndX, pEndY, height, fixed, mass, elasticity, friction) {
			this._initialX = pInitialX;
			this._initialY = pInitialY;
			this._endX = pEndX;
			this._endY = pEndY;

			var adjacent = pEndX - pInitialX;
			var opposite = pEndY - pInitialY;
			x = ((pInitialX + pEndX) / 2);
			y = ((pInitialY + pEndY) / 2);
			width = Math.sqrt( Math.pow(Math.abs(adjacent),2) + Math.pow(Math.abs(opposite),2) );
			rotation = Math.atan(opposite/adjacent);
			
			rotation = rotation || 0;
			mass = mass || 1;
			elasticity = elasticity || 0.3;
			friction = friction || 0;
			this._extents = [width/2, height/2, pInitialX, pInitialY, pEndX, pEndY];
			this._axes = [new JPE.Vector(0,0), new JPE.Vector(0,0)];
			
			this.setRadian(rotation);
			JPE.EdgeParticle.superclass.prototype.constructor.call(this, x, y, width, height, rotation, fixed, mass, elasticity, friction);
		},
	
		getRadian: function () {
			return this._radian;
		},
		
		/**
		 * @private
		 */		
		setRadian: function (t) {
			this._radian = t;
			this.setAxes(t);
		},
			
		
		/**
		 * The rotation of the RectangleParticle in degrees. 
		 */
		getAngle: function () {
			return this.getRadian() * JPE.MathUtil.ONE_EIGHTY_OVER_PI;
		},


		/**
		 * @private
		 */		
		setAngle: function (a) {
			this.setRadian (a * JPE.MathUtil.PI_OVER_ONE_EIGHTY);
		},
			
		
		setWidth: function (w) {
			this._extents[0] = w/2;
		},

		
		getWidth: function () {
			return this._extents[0] * 2;
		},


		setHeight: function (h) {
			this._extents[1] = h / 2;
		},


		getHeight: function () {
			return this._extents[1] * 2;
		},

		/**
		 * @private
		 */	
		getExtents: function () {
			return this._extents;
		},
		
		
		/**
		 * @private
		 */	
		getProjection: function (axis) {
			var axes = this.getAxes(),
				 extents = this.getExtents(),
			     radius = extents[0] * Math.abs(axis.dot(axes[0])) + extents[1] * Math.abs(axis.dot(axes[1]));
			
			var c = this.samp.dot(axis);
			this.interval.min = c - radius;
			this.interval.max = c + radius;
			return this.interval;
		},

		/**
		 * @private
		 */	
		getAxes: function () {
			return this._axes;
		},
		/**
		 * 
		 */					
		setAxes: function(t) {
			var s = Math.sin(t),
				 c = Math.cos(t),
				 axes = this.getAxes();
			
			axes[0].x = c;
			axes[0].y = s;
			axes[1].x = -s;
			axes[1].y = c;
		}

});