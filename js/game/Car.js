JPE.declare("Car", {

	superclass: JPE.Group,
	
	wheelParticleA: null,
	wheelParticleB: null,
	rect:null,

	constructor: function(colC, colE, axelWidth, layer){

		JPE.Car.superclass.prototype.constructor.apply(this);

		this.layer = layer;

		this.axelWidth = axelWidth;

		this.durability = 0;

		var WheelParticle = JPE.WheelParticle,
			SpringConstraint = JPE.SpringConstraint,
			RectangleParticle = JPE.RectangleParticle;

		var wheelParticleA = new WheelParticle(15,10,10,false,2);
		wheelParticleA.setStyle(0, colC, 1, colE);
		this.addParticle(wheelParticleA);
		wheelParticleA.lifeEndingLayer = 'deathtrap';
		
		var wheelParticleB = new WheelParticle(15+axelWidth,10,10,false,2);
		wheelParticleB.setStyle(1, colC, 1, colE);
		this.addParticle(wheelParticleB);
		wheelParticleB.lifeEndingLayer = 'deathtrap';

		var wheelConnector = new SpringConstraint(wheelParticleA, wheelParticleB, .5, true, 8, 1, null, false);
		wheelConnector.setStyle(1, colC, 1, colE);
		this.addConstraint(wheelConnector);

		this.carArt = new JPE.FollowerParticle(wheelConnector, 0, 0, layer);
		this.addParticle(this.carArt);

		// var rect = new RectangleParticle(15, 10, 50, 50, 0, false, 1, .3, 0, true, wheelConnector);
		// this.addParticle(rect);

		this.wheelParticleA = wheelParticleA;
		this.wheelParticleB = wheelParticleB;
		this.rect = null;
		// this.rect = rect;
	},

	addCarArt: function(img, offsetX, offsetY, width, height) {
		this.carArt.addCssImage(img, offsetX, offsetY, width, height);
	},


	updateProperties: function(mass, elasticity, friction, traction, maxSpeed, durability) {
		this.wheelParticleA.setMass(mass);
		this.wheelParticleA.setElasticity(elasticity);
		this.wheelParticleA.setFriction(friction);
		this.wheelParticleA.setTraction(traction);
		this.wheelParticleA.setMaxSpeed(maxSpeed);

		this.wheelParticleB.setMass(mass);
		this.wheelParticleB.setElasticity(elasticity);
		this.wheelParticleB.setFriction(friction);
		this.wheelParticleB.setTraction(traction);
		this.wheelParticleB.setMaxSpeed(maxSpeed);

		this.durability = durability;

//		console.log(this);
	},

	getMass: function() {
		return this.wheelParticleA.getMass();
	},

	getElasticity: function() {
		return this.wheelParticleA.getElasticity();
	},

	getFriction: function() {
		return this.wheelParticleA.getFriction();
	},

	getTraction: function() {
		return this.wheelParticleA.getTraction();
	},

	getMaxSpeed: function() {
		return this.wheelParticleA.getMaxSpeed();
	},

	setMaxSpeed: function(s) {
		this.wheelParticleA.setMaxSpeed(s);
		this.wheelParticleB.setMaxSpeed(s);
	},

	reset: function() {
		this.resetLocation();
		this.setSpeed(0);
	},

	getPosition: function() {
		return this.carArt.getCenter();
	},

	resetLocation: function() {
		this.setLocation(this.initialX, this.initialY);
	},

	setLocation: function(x, y) {
		this.wheelParticleA.setPx(x);
		this.wheelParticleA.setPy(y);

		this.wheelParticleB.setPx(x+this.axelWidth);
		this.wheelParticleB.setPy(y);

		// this.rect.setPx(x+this.axelWidth/2);
		// this.rect.setPy(y-25);
		
	},

	setStartLocation: function(x, y) {
		this.initialX = x;
		this.initialY = y;
		this.resetLocation();
	},
	
	setSpeed: function(sx, sy)
	{
		// this.wheelParticleA.setAngularVelocity(s);
		// this.wheelParticleB.setAngularVelocity(s);
		this.wheelParticleA.addForce(new JPE.Vector(sx,sy));
		this.wheelParticleB.addForce(new JPE.Vector(sx,sy));
	},

	isGrounded: function() {
		return ( this.wheelParticleA.isColliding() && this.wheelParticleB.isColliding() ) ? true : false;
	},

	isUpsideDown: function() {
		return ( this.wheelParticleB.getPosition().x - this.wheelParticleA.getPosition().x < 0 ) ? true : false;
	},

	isUpsideDownAndGrounded: function() {
		return ( this.isGrounded() && this.isUpsideDown() ) ? true : false;
	},

	startBlinkRoutine: function( callback ) {
		var c = $(this.carArt.layer.domElement);
//		console.log(this);
//		console.log(c);

		c.css('opacity', 0);
		setTimeout( function(){ c.css('opacity', 1); }, 100 );
		setTimeout( function(){ c.css('opacity', 0); }, 200 );
		setTimeout( function(){ c.css('opacity', 1); }, 300 );
		setTimeout( function(){ c.css('opacity', 0); }, 400 );
		setTimeout( function(){ c.css('opacity', 1); }, 500 );
		setTimeout( function(){ c.css('opacity', 0); }, 600 );
		setTimeout( function(){ c.css('opacity', 1); }, 700 );
		setTimeout( function(){ callback(); }, 800 );
	}
});