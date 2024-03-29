JPE.declare('WheelParticle',  {
	
		superclass: JPE.CircleParticle,
		/**
		 * @param x The initial x position of this particle.
		 * @param y The initial y position of this particle.
		 * @param radius The radius of this particle.
		 * @param fixed Determines if the particle is fixed or not. Fixed particles
		 * are not affected by forces or collisions and are good to use as surfaces.
		 * Non-fixed particles move freely in response to collision and forces.
		 * @param mass The mass of the particle.
		 * @param elasticity The elasticity of the particle. Higher values mean more elasticity or 'bounciness'.
		 * @param friction The surface friction of the particle.
		 */
		constructor: function(x, y, radius, fixed, mass, elasticity, friction, traction, maxSpeed) {
			traction = traction || 1;
			mass = mass || 1;
			elasticity = elasticity || 0.3;
			friction = friction || 0;
			this.lineThickness = 1;
			JPE.WheelParticle.superclass.prototype.constructor.apply(this, arguments);
			this.tan = new JPE.Vector(0, 0);
			this.normSlip = new JPE.Vector(0, 0);
			this.rp = new JPE.RimParticle(radius, 2);
			this.orientation = new JPE.Vector();
			this.setTraction(traction);
			this.maxSpeed = maxSpeed || null;
		},

		getMaxSpeed: function() {
			return this.maxSpeed;
		},

		setMaxSpeed: function(s) {
			return this.maxSpeed = s;
		},
		
		getSpeed: function () {
			return this.rp.getSpeed();
		},
		
		setSpeed: function (t) {
			this.rp.setSpeed(t);
		},

		decreaseSpeed: function(t) {
			var sp = this.rp.getSpeed();
			if ( sp - t > 0 )
			{
				this.rp.setSpeed(sp - t);
			}
			else
			{
				this.rp.setSpeed(0);
			}
		},

		getAngularVelocity: function () {
			return this.rp.getAngularVelocity();
		},
		
	
		setAngularVelocity: function (t) {
			this.rp.setAngularVelocity(t);
		},

		getTraction: function () {
			return 1 - this._traction;
		},
		
		setTraction: function (t) {
			this._traction = 1 - t;
		},	

		update: function (dt) {
			JPE.WheelParticle.superclass.prototype.update.call(this, dt);
			this.rp.update(dt);
		},

		/**
		 * The rotation of the wheel in radians.
		 */
		getRadian: function () {
			this.orientation.setTo(this.rp.curr.x, this.rp.curr.y);
			return Math.atan2(this.orientation.y, this.orientation.x) + Math.PI;
		},


		/**
		 * The rotation of the wheel in degrees.
		 */
		getAngle: function () {
			return this.getRadian() * JPE.MathUtil.ONE_EIGHTY_OVER_PI;
		},
	
	
		/**
		 * @private
		 */		
		resolveCollision: function (mtd, vel, n, d, o, p) {
			JPE.WheelParticle.superclass.prototype.resolveCollision.apply(this, arguments);
			// review the o (order) need here - its a hack fix
			this.resolve(n.mult(JPE.MathUtil.sign(d * o)));
		},
		
	
		/**
		 * simulates torque/wheel-ground interaction - n is the surface normal
		 * Origins of this code thanks to Raigan Burns, Metanet software
		 */
		resolve:function (n) {
			// this is the tangent vector at the rim particle
			var rp = this.rp,
				tan = this.tan;

			tan.setTo(-rp.curr.y, rp.curr.x);
			// normalize so we can scale by the rotational speed
			tan = tan.normalize();
	
			// velocity of the wheel's surface 
			var wheelSurfaceVelocity = tan.mult(rp.getSpeed());
			
			// the velocity of the wheel's surface relative to the ground
			var combinedVelocity = this.getVelocity().plusEquals(wheelSurfaceVelocity);
		
			// the wheel's comb velocity projected onto the contact normal
			var cp = combinedVelocity.cross(n);
	
			// set the wheel's spinspeed to track the ground
			tan.multEquals(cp);
			rp.prev.copy(rp.curr.minus(tan));
	
			// some of the wheel's torque is removed and converted into linear displacement
			var slipSpeed = (1 - this._traction) * rp.getSpeed();
			this.normSlip.setTo(slipSpeed * n.y, slipSpeed * n.x);
			this.curr.plusEquals(this.normSlip);
			rp.setSpeed( rp.getSpeed() * this._traction);	
			//console.log("Speed: " + rp.getSpeed());
		}

});