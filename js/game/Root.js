JPE.declare("Root", {

	constructor: function(levelFile, gameFile, worldPropertiesFile, cssDrawingContainer, racepage, callback) {

		// VARIABLES
		this.isInit = false;

		this.callback = callback;

		this.tickCount = 0;
		this.stuckCount = 0;

		this.firstGameStart = false;
		this.initialTime = 0;
		this.date = new Date();

		// Debug Colors
		var colA = 0x334433;
		var colB = 0x3366aa;
		var colC = 0xaabbbb;
		var colD = 0x6699aa;
		var colE = 0x778877;
		
		this.REPAIR_DURATION = 10;
		this.OEM_REPAIR_DURATION = 5;
		this.STUCK_DURATION = 4;

		this.brakeApplied = false;

		this.brakeStartXPos = null;
		this.brakeStartYPos = null;
		this.brakeStartXEnd = null;
		this.brakeStartYEnd = null;

		this.currentBrakeZone = null;

		this.brakeZoneInterval = null;

		var owner = this;

		this.setContainer(racepage);

		this.levelFile = levelFile;
		this.gameFile = gameFile;
		this.worldProps = worldPropertiesFile;

		this.cssDrawingContainer = cssDrawingContainer;

		// Set up Game Renderer with appropriate Layers
		// this.renderer = new GameRenderer("canvas");
		// this.backgroundLayer = this.renderer.createLayer("background");
		// this.foregroundLayer = this.renderer.createLayer("foreground");
		// this.JPELayer = this.renderer.createLayer("JPELayer");
		// this.collobstaclesLayer = this.renderer.createLayer("collobstacles");

		this.renderer = new CssGameRenderer(cssDrawingContainer);
		this.renderer.createLayer("background");
		this.renderer.createLayer("world");
		this.renderer.createLayer("foreground", "world");
		this.renderer.createLayer("collobstacles", "world");
		this.renderer.createLayer("car", "world");
		this.renderer.createLayer("brakeZones", "world");

		// ViewPort Container Div, to be updated in tick
		this.viewPortRect = new Rect(0,0,984,558);

		JPE.Engine.init(1/4);

		// set the renderer to easel renderer
		JPE.Engine.renderer = new JPE.EaselRenderer(null);
		
		this.car = new JPE.Car(colC, colE, 76, this.renderer.getLayer('car'));

		// DSK CHANGES END

		JPE.Engine.addGroup(this.car);

		// groups - all these classes extend group
		this.surfaces = new JPE.Surfaces(colA, colB, colC, colD, colE);
		this.deathTraps = new JPE.Surfaces(colA, colB, colC, colD, colE);
		
		JPE.Engine.addGroup(this.surfaces);
		JPE.Engine.addGroup(this.deathTraps);
		
		// determine what collides with what.
		this.car.addCollidableList([this.surfaces]);
		this.car.addCollidableList([this.deathTraps]);

		//this.collectables = new Collections();
		//this.obstacles = new Collections();
		this.collobstacles = new Array();

		this.checkpoints = new Array();

		this.brakeZones = new Array();

		// this.scoringSystem = new ScoringSystem();

		// this.scoringSystem.setInitialInvestment(window.main.bottomNavigation.amountOfMoney);

		// Load Game Properties
		this.gameProperties = new GameProperties();

		// Load Images
		this.imageResources = new ImageResources();
		this.imageResources.loader.addCompletionListener(function(){
//			console.log("Image Resources Loaded!");
			// Setup Image Layers
			// var bgBitmap = new createjs.Bitmap(owner.imageResources.images['background_sky']);
			// owner.backgroundLayer.addChild(bgBitmap);
			owner.renderer.appendToLayer("background", $( (new CssImage(owner.imageResources.images['background_sky'], 984, 558)).domElement) );

			owner.dynamicForeground = new DynamicForeground(owner.renderer.getLayer('foreground'), owner);

			// Load Game Properties File
			if ( owner.gameFile != null )
			{
				owner.loadGameProperties(owner.gameFile);
			}
			else
			{
				owner.loadGameProperties("json/game_properties.json");
			}
		});
		this.imageResources.loadImages();

		this.operatingCostTicker = null;
	},

	onGameLoaded: function() {
		this.callback();
		this.isInit = true;
	},

	freshStart: function() {

		// Only set to the front wheel for death traps due to edge cases.
		this.car.wheelParticleB.lifeEndingAction = function(){
			owner.car.wheelParticleB.lifeEndingActionStarted = true;

			if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
				owner.stop(true);
			else
				owner.stop(false);

			owner.car.startBlinkRoutine( function(){
				if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM ){
					console.log('oem repair lifeending');
					owner.car.startBlinkRoutine( function(){ 
						owner.oemRepairCar(); 
						setTimeout( function(){ owner.car.wheelParticleB.lifeEndingActionStarted = false; }, owner.OEM_REPAIR_DURATION );
					} );
				} else {
					console.log('repair car lifeending');
					owner.car.startBlinkRoutine( function(){ 
						owner.repairCar(); 
						setTimeout( function(){ owner.car.wheelParticleB.lifeEndingActionStarted = false; }, owner.REPAIR_DURATION );
					} );
				}
			});
		};
		
		var owner = this;

		// add car art
		// spoiler - this.main.carBuild.spoiler 
		if ( window.main.carBuild.spoiler )
		{
			owner.car.addCarArt(owner.imageResources.images['spoiler'], -55, -40, 26, 35);
		}
		// person
		owner.car.addCarArt(owner.imageResources.images['driver'], -30, -38, 38, 32);
		// roll bar - this.main.carBuild.roll_bar
		if ( window.main.carBuild.roll_bar )
		{
			owner.car.addCarArt(owner.imageResources.images['support_bar'], -33, -23, 39, 12);
		}
		// chassis
		owner.car.addCarArt(owner.imageResources.images['chassis_'+ window.main.parts.chassis[window.main.carBuild.chassis-1].type], -50, -20, 100, 22);
		
		// Brakes
		owner.car.addCarArt(owner.imageResources.images['brake_' + window.main.parts.brakes[window.main.carBuild.brakes-1].type], -34, -14, 67, 8);

		// wheel left
		owner.car.addCarArt(owner.imageResources.images['wheel_' + window.main.parts.wheels[window.main.carBuild.wheels-1].type + '_left'], -48, -10, 19, 19);
		// wheel right
		owner.car.addCarArt(owner.imageResources.images['wheel_' + window.main.parts.wheels[window.main.carBuild.wheels-1].type + '_right'], 29, -10, 19, 19);

		// Shocks / Dampers
		if ( window.main.carBuild.shocks )
		{
			owner.car.addCarArt(owner.imageResources.images['shocks'], -40, -18, 80, 14);
		}

		var bzs = owner.renderer.getLayer('brakeZones');

		for( var i = 0; i < owner.brakeZones.length; i++ )
		{
			if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
			{
				var obj = owner.brakeZones[i];
				bzs.addImageAtXY(owner.imageResources.images['brake_flag_start'], 22, 90, obj.xStart, obj.yStart - 45, 'bFlag-' + i + '-start', -1);
				bzs.addImageAtXY(owner.imageResources.images['brake_flag_end'], 22, 90, obj.xEnd, obj.yEnd - 45, 'bFlag-' + i + '-end', -1);
			}
		}
	},

	// Gets loaded after image resources are all loaded (inside constructor)
	loadGameProperties: function(file) {
//		console.log("Load Game Properties");
		var instance = this;
		$.ajax({
			url: file,
			async: false,
			dataType: "json",
			success: function(data) 
			{
				instance.gameProperties.distributeContent(data);

				// Load Level
				if ( instance.levelFile != null )
				{
					instance.loadLevelFile(instance.levelFile);
				}
				else
				{
					instance.loadLevelFile("json/level.json");
				}
			}
		});
	},

	// Gets loaded after loadGameProperties ( inside success ajax function )
	loadLevelFile: function(file) {
//		console.log("Load Level File: " + file);
		var instance = this;
		$.ajax({
			url: file,
			async: false,
			dataType: "json",
			success: function(data) 
			{
				instance.surfaces.loadLevel(data.level, 'terrain');
				instance.deathTraps.loadLevel(data.deathTraps, 'deathtrap');
				instance.car.setStartLocation(parseFloat(data.startLocation.x), parseFloat(data.startLocation.y));
				instance.gameProperties.endLocation.x = parseFloat(data.endLocation.x);
				instance.gameProperties.endLocation.y = parseFloat(data.endLocation.y);
				var obj;
				for( var k = 0; k < data.checkpoints.length; k++ )
				{
					obj = data.checkpoints[k];
					var cp = new Object();
					cp.x = obj.x;
					cp.y = obj.y;
					instance.checkpoints.push(cp);
				}
				for( var i = 0; i < 12; i++ )
				{
					instance.collobstacles[i] = new Array();
					for( var j = 0; j < 25; j++ )
					{
						instance.collobstacles[i][j] = new Collections();

						var currRect = new Rect( j * 1000, i * 1000, 1000, 1000 );

						for( var l = 0; l < data.obstacles.length; l++ )
						{
							obj = data.obstacles[l];

							if( currRect.contains( obj.x, obj.y ) )
							{
								var o = new Obstacle( obj.type, obj.x, obj.y, false );
								o.addValue(obj.value);
								o.loadImage(instance.imageResources.images[obj.type], obj.width, obj.height);
								instance.collobstacles[i][j].push(o);
							}
						}
						for( var p = 0; p < data.collectables.length; p++ )
						{
							obj = data.collectables[p];

							if( currRect.contains( obj.x, obj.y) )
							{
								var c = new Collectable( obj.type, obj.x, obj.y, false );
								c.addValue(obj.value);
								c.loadImage(instance.imageResources.images[obj.type], obj.width, obj.height);
								instance.collobstacles[i][j].push(c);
							}
						}
					}
				}
				for ( var n = 0; n < data.brakeZones.length; n++ )
				{
					obj = data.brakeZones[n];
					var bz = new Object();

					bz.xStart = parseFloat( obj.xStart );
					bz.yStart = parseFloat( obj.yStart );
					bz.xEnd = parseFloat( obj.xEnd );
					bz.yEnd = parseFloat( obj.yEnd );
					bz.velocity = parseFloat( obj.velocity );
					bz.percentage = parseFloat( obj.percentage );
					bz.startId = 'bFlag-' + n + '-start';
					bz.endId = 'bFlag-' + n + '-end';

					instance.brakeZones.push(bz);
				}
				if( instance.pageContainer != null )
				{
					// console.log('PAGE CONTAINER NOT NULL');
					// console.log(instance.pageContainer.main.carWorldProps);
					instance.loadWorldProperties(instance.worldProps,instance.pageContainer.main.carWorldProps);
				} else {
					// console.log('PAGE CONTAINER NULL');
					instance.loadWorldProperties('json/world_properties.json',null);
				}
				// console.log(instance.checkpoints);
				instance.freshStart();
			}
		});
	},

	// Gets called after level has been loaded and constructed
	loadWorldProperties: function(jsonFile,carProps) {
//		console.log("Load World Properties - " + jsonFile);
		var instance = this;

		if( carProps == null )
		{
			$.ajax({
				url: jsonFile,
				async: false,
				dataType: "json",
				success: function(data) 
				{
					instance.uploadAllProperties(data);
					instance.initControls();
				}
			});
		} else {
//			console.log( 'Root -- loadWorldProperties() via carWorldProps')
			instance.uploadAllProperties(null,carProps);
			instance.initControls();
		}
	},

	// Gets called after world properties file has been loaded and constructed.
	initControls: function() {
//		console.log("Init Controls");
		var owner = this;
		// Setup Controls
		YUI().use('node-base', function(Y){
			Y.one(Y.config.doc).on('keydown', function(e){
				owner.keyDownHandler(e);
			});
			Y.one(Y.config.doc).on('keyup', function(e){
				owner.keyUpHandler(e);
			});
		});
		this.onGameLoaded();
	},

	startGame: function() {
//		console.log("Start Game!");
		var owner = this;

		if ( !this.firstGameStart )
		{
			this.firstGameStart = true;
			this.initialTime = this.date.getTime();
		}
		clearInterval(this.operatingCostTicker);
		
		this.operatingCostTicker = setInterval(function(){
			// tick operating costs
			window.main.scoringSystem.addOperatingCosts(owner.gameProperties.operatingCost);
		}, this.gameProperties.operatingCostTick);
	
		createjs.Ticker.addListener(this);
	    createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);
		createjs.Ticker.setPaused(false);
	},

	resumeFromOem: function() {
//		console.log('Resume Game Oem');
		var instance = this;

		clearInterval(this.operatingCostTicker);

		this.operatingCostTicker = setInterval(function(){
			// tick operating costs
			window.main.scoringSystem.addOperatingCosts(instance.gameProperties.operatingCost);
		}, this.gameProperties.operatingCostTick);

		createjs.Ticker.setPaused(false);
	},

	resumeFromNonOem: function () {
//		console.log('Resume Game');
		var instance = this;

		createjs.Ticker.setPaused(false);
	},

	pause: function() {
		clearInterval(this.gameInterval);
	},

	moneyRemaining: function() {
		// if the user doesn't have enough money to continue, then its game over
		if ( window.main.scoringSystem.outOfMoney )
		{
			return false;
		}
		return true;
	},

	checkWinCondition: function(xPos, yPos) {
		var endLocation = this.gameProperties.endLocation;
		var threshold = 40;
		if ( xPos >= endLocation.x )// && xPos <= (endLocation.x + threshold) )
		{
			//if ( yPos >= endLocation.y && yPos <= (endLocation.y + threshold) )
			//{
//				console.log("WIN GAME!");
				this.gameSuccess();
				return true;
			//}
		}
		return false;
	},

	tick: function() {
		var instance = this;

		if ( this.moneyRemaining() )
		{
			this.tickCount++;

			JPE.Engine.step();
			this.renderer.getLayer('car').update();

			var carPos = this.car.getPosition();

			this.viewPortRect.x = -this.renderer.getLayer('world').x;
			this.viewPortRect.y = -this.renderer.getLayer('world').y;

			if ( carPos.x > 200 + (-this.renderer.getLayer('world').x))
			{
				this.renderer.getLayer('world').x -= this.car.wheelParticleA.getVelocity().x;
			}

			if ( carPos.y > 200 + (-this.renderer.getLayer('world').y) )
			{
				if ( this.car.wheelParticleA.getVelocity().y > 0 ) // Clamping camera so there is no camera jerk upwards
				{
					this.renderer.getLayer('world').y -= this.car.wheelParticleA.getVelocity().y;
				}
			}
			this.renderer.getLayer('world').update();

			for( var i = 0; i < this.brakeZones.length; i++ )
			{
				if( this.viewPortRect.contains( this.brakeZones[i].xStart, this.brakeZones[i].yStart ) )
				{
					this.currentBrakeZone = i;
				}
			}
			
			// *** Moved to Dynamic ForeGround ***
			// this.collectables.checkCollision(this.renderer.getLayer('car').x, this.renderer.getLayer('car').y);
			// this.obstacles.checkCollision(this.renderer.getLayer('car').x, this.renderer.getLayer('car').y);

			// this.collectables.render( this.viewPortRect, this.tickCount );
			// this.obstacles.render( this.viewPortRect, this.tickCount );
			// *** ***

			this.dynamicForeground.update(this.renderer.getLayer('car').x, this.renderer.getLayer('car').y);

			if( this.car.isUpsideDownAndGrounded() )
			{
				if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
				{
					this.stop(true);
					this.car.startBlinkRoutine( function(){ instance.oemRepairCar(); } );
				} else {
					this.stop(false);
					this.car.startBlinkRoutine( function(){ instance.repairCar(); } );
				}
			}
			
			if ( this.checkWinCondition(this.renderer.getLayer('car').x, this.renderer.getLayer('car').y) )
			{
				return;
			}

			if( this.car.wheelParticleA.getVelocity().x < 1 && carPos.x > 250 )
			{
				this.stuckCount++;

				// 60 frames per second, 240 ticks = 4 seconds velocity less than 1, then stuck
				if( this.stuckCount > 240 )
				{
					if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
						this.carIsStuck(window.main.BUILD_TYPE_OEM, this.STUCK_DURATION);
					else
						this.carIsStuck("not_oem_car", this.STUCK_DURATION);

					this.stuckCount = 0;
				}
				return;
			}
			this.stuckCount = 0;
		} else {
			this.gameOver();
		}
	},

	stop: function(shouldClearOperating) {

		if( shouldClearOperating )
			clearInterval(this.operatingCostTicker);

		clearInterval(this.gameInterval);
		createjs.Ticker.setPaused(true);
	},
	
	run: function(s){
		this.collectables.render();
	// 	JPE.Engine.step();
	// 	JPE.Engine.paint();
	// 	this.stage.update();

	// 	var carPos = this.car.wheelParticleA.getPosition();
	// 	//console.log("CarX: " + carPos.x + ", CarY: " + carPos.y);
	// 	if ( carPos.x > 100 + (-JPE.Engine.renderer.background.x))
	// 	{
	// 		JPE.Engine.renderer.background.x -= this.car.wheelParticleA.getVelocity().x;
	// 	}

	// 	if ( carPos.y > 100 + (-JPE.Engine.renderer.background.y) )
	// 	{
	// 		if ( this.car.wheelParticleA.getVelocity().y > 0 ) // Clamping camera so there is no camera jerk upwards
	// 		{
	// 			JPE.Engine.renderer.background.y -= this.car.wheelParticleA.getVelocity().y;
	// 		}
	// 	}

		

	// 	JPE.Engine.paint();
	// 	this.stage.update();
	},

	reset: function() {
//		console.log('RESET');

		this.car.reset();
		this.renderer.getLayer('world').x = 0;
		this.renderer.getLayer('world').y = 0;

		for( var i = 0; i < 12; i++ )
		{
			for( var j = 0; j < 25; j++ )
			{
				for( var k = 0; k < this.collobstacles[i][j].collection.length; k++ )
				{
					var c = this.collobstacles[i][j].collection[k];
					c.visible = false;
					c.enabled = true;
					c.collided = false;
					c.domAnimation.enable();

					//console.log(this.collobstacles[i][j].collection[k]);
				}
			}
		}
		//console.log(this.collobstacles);

		JPE.Engine.step();
		this.renderer.getLayer('car').update();
		this.renderer.getLayer('world').update();

		this.car.carArt.removeAllCssImages();

		var bzs = this.renderer.getLayer('brakeZones');

		for( var l = 0; l < this.brakeZones.length; l++ )
		{
			var bz = this.brakeZones[l];

			bzs.removeImageById(bz.startId);
			bzs.removeImageById(bz.endId);
		}

		clearInterval(this.gameInterval);
		clearInterval(this.operatingCostTicker);
	},

	applyBrake: function(sx, sy) {
		if( this.car.wheelParticleA.getVelocity().x > 2 && this.car.isGrounded() )
			this.car.setSpeed(sx, sy);
	},

	setContainer: function(con) {
		this.pageContainer = con;
	},

	gameOver: function() {
		this.stop(true);
		soundManager.play('aww');
		if ( this.pageContainer )
		{
			console.log("*************** SERVER ANALYTICS - SENDING... ***************");
	        console.log("URL: api/analytics/create/stat/");
	        console.log("Key: Race Ended - Game Over");
			$.ajax({
	            type: "GET",
	            url: this.pageContainer.main.SERVER_URL + "api/analytics/create/stat/", 
	 			dataType: "jsonp",
	            data: { api_key: this.pageContainer.main.API_KEY, project_key: this.pageContainer.main.PROJECT_KEY, user: this.pageContainer.main.USER_KEY, key: this.pageContainer.main.KEY_RACES_ENDED_GAME_OVER, value:"1", platform:$.client.os, os:$.client.browser },
	 			callback: 'jsonp',
	            success: function(data) {
	 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
	                console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
	                console.log("Key: Race Ended - Game Over");
	                console.log("*************** SERVER ANALYTICS - END ***************");
	            }
	        });
			this.sendGameStatsToServer();
			this.pageContainer.showPopup(this.pageContainer.GAME_OVER_POPUP, 0);
		}
	},

	sendGameStatsToServer:function() {
		var newDate = new Date();
		var totalGameTime = newDate.getTime() - this.initialTime;
		totalGameTime /= 1000;
		totalGameTime = Math.floor(totalGameTime);
		// console.log("Initial Time: " + this.initialTime + ", Total Game Time: " + newDate.getTime());
		this.firstGameStart = false;
		var instance = this;
		console.log("*************** SERVER ANALYTICS - SENDING... ***************");
        console.log("URL: api/analytics/create/stat/");
        console.log("Key: Race Ended");
		$.ajax({
            type: "GET",
            url: this.pageContainer.main.SERVER_URL + "api/analytics/create/stat/", 
 			dataType: "jsonp",
            data: { api_key: this.pageContainer.main.API_KEY, project_key: this.pageContainer.main.PROJECT_KEY, user: this.pageContainer.main.USER_KEY, key: this.pageContainer.main.KEY_RACES_ENDED, value:"1", platform:$.client.os, os:$.client.browser },
 			callback: 'jsonp',
            success: function(data) {
 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
                console.log("Key: Race Ended");
                console.log("*************** SERVER ANALYTICS - END ***************");
            }
        });
		console.log("*************** SERVER ANALYTICS - SENDING... ***************");
        console.log("URL: api/analytics/create/stat/");
        console.log("Key: Race Length");
        console.log("Time: " + totalGameTime);
		$.ajax({
            type: "GET",
            url: this.pageContainer.main.SERVER_URL + "api/analytics/create/stat/", 
 			dataType: "jsonp",
            data: { api_key: this.pageContainer.main.API_KEY, project_key: this.pageContainer.main.PROJECT_KEY, user: this.pageContainer.main.USER_KEY, key: this.pageContainer.main.KEY_RACE_LENGTH, value:totalGameTime, platform:$.client.os, os:$.client.browser },
 			callback: 'jsonp',
            success: function(data) {
 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
                console.log("Key: Race Length");
                console.log("*************** SERVER ANALYTICS - END ***************");
            }
        });
		console.log("*************** SERVER ANALYTICS - SENDING... ***************");
        console.log("URL: api/dell1037leaderboard/get/rank/");
        console.log("Score: " + this.pageContainer.main.scoringSystem.getRevenue());
        console.log("Path: " + this.pageContainer.main.carBuild.buildPathName);
        var currentCarPath = "";
        switch(this.pageContainer.main.carBuild.buildPathName)
        {
        	case "offtheshelf":
        		currentCarPath = "Off-the-Shelf";
        		break;
        	case "oem":
        		currentCarPath = "OEM";
        		break;
        	case "custom":
        		currentCarPath = "Custom";
        		break;
        }
		$.ajax({
            type: "GET",
            url: this.pageContainer.main.SERVER_URL + "api/dell1037leaderboard/get/rank/", 
 			dataType: "jsonp",
            data: { api_key: this.pageContainer.main.API_KEY, project_key: this.pageContainer.main.PROJECT_KEY, user: this.pageContainer.main.USER_KEY, score:this.pageContainer.main.scoringSystem.getRevenue(), path:currentCarPath },
 			callback: 'jsonp',
            success: function(data) {
 				instance.pageContainer.main.UNIQUE_RANK_ID = data.uuid;
 				instance.pageContainer.main.LEADERBOARD_SCORES = data.scores;
 				instance.pageContainer.main.USERS_RANK = data.rank;
 				instance.pageContainer.main.LEADERBOARD_TOP_TEN = data.topten;
 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                console.log("api/dell1037leaderboard/get/rank/ - SUCCESS: " + data.SUCCESS);
                console.log("UUID: " + data.uuid);
                console.log("SCORES: " + data.scores);
                for ( var i = 0; i < instance.pageContainer.main.LEADERBOARD_SCORES.length; i++ )
 				{
 					console.log("Rank: " + instance.pageContainer.main.LEADERBOARD_SCORES[i].rank + ", Score: " + instance.pageContainer.main.LEADERBOARD_SCORES[i].score + ", Initials: " + instance.pageContainer.main.LEADERBOARD_SCORES[i].initials + ", Path: " + instance.pageContainer.main.LEADERBOARD_SCORES[i].path);
 				}
 				console.log("TOP 10: " + data.topten);
 				for ( var i = 0; i < instance.pageContainer.main.LEADERBOARD_TOP_TEN.length; i++ )
 				{
 					console.log("Rank: " + instance.pageContainer.main.LEADERBOARD_TOP_TEN[i].rank + ", Score: " + instance.pageContainer.main.LEADERBOARD_TOP_TEN[i].score + ", Initials: " + instance.pageContainer.main.LEADERBOARD_TOP_TEN[i].initials + ", Path: " + instance.pageContainer.main.LEADERBOARD_TOP_TEN[i].path);
 				}
                console.log("RANK: " + data.rank);
                console.log("*************** SERVER ANALYTICS - END ***************");
            }
        });
	},

	gameSuccess: function() {
		this.stop(true);
		soundManager.play('crowd', { volume : 40 });
		if ( this.pageContainer )
		{
			console.log("*************** SERVER ANALYTICS - SENDING... ***************");
	        console.log("URL: api/analytics/create/stat/");
	        console.log("Key: Race Ended Success");
			$.ajax({
	            type: "GET",
	            url: this.pageContainer.main.SERVER_URL + "api/analytics/create/stat/", 
	 			dataType: "jsonp",
	            data: { api_key: this.pageContainer.main.API_KEY, project_key: this.pageContainer.main.PROJECT_KEY, user: this.pageContainer.main.USER_KEY, key: this.pageContainer.main.KEY_RACES_ENDED_GAME_SUCCESS, value:"1", platform:$.client.os, os:$.client.browser },
	 			callback: 'jsonp',
	            success: function(data) {
	 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
	                console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
	                console.log("Key: Race Ended - Game Win");
	                console.log("*************** SERVER ANALYTICS - END ***************");
	            }
	        });
			this.sendGameStatsToServer();
			this.pageContainer.showPopup(this.pageContainer.GAME_SUCCESS_POPUP, 0);
		}
	},

	repairCar: function() {

//		console.log('repair car');
		this.stop(false);

		var racePage = window.main.pages[window.main.RACE_PAGE];

		if ( this.pageContainer )
		{
			var amountLeft = window.main.scoringSystem.getRevenue() - 500;

			if( amountLeft > 0 )
			{
				this.pageContainer.showPopup(this.pageContainer.REPAIRS_POPUP, this.REPAIR_DURATION);
				var instance = this;
				this.pageContainer.main.scoringSystem.addOperatingCosts(500);
				soundManager.play('repair', { volume : 50, loops: 2 });
				setTimeout(function(){
					instance.pageContainer.hidePopup(instance.pageContainer.REPAIRS_POPUP);
					instance.resetToCheckpoint();
					racePage.resetHealth();
					Utilities.fadeSoundOut('repair');
				}, this.REPAIR_DURATION*1000 );
			} else {
				this.gameOver();
			}
		}
	},

	carIsStuck: function(type, duration) {
		var amountLeft = 0;

		if ( type == window.main.BUILD_TYPE_OEM )
		{
			this.stop(true);
			amountLeft = window.main.scoringSystem.getRevenue();
		}
		else 
		{
			amountLeft = window.main.scoringSystem.getRevenue() - 100;
			window.main.scoringSystem.addOperatingCosts(100);
		}

		var racePage = window.main.pages[window.main.RACE_PAGE];

		if ( amountLeft > 0 )
		{
			if ( this.pageContainer )
			{
				this.pageContainer.showPopup(this.pageContainer.STUCK_POPUP, duration);
				var instance = this;
				soundManager.play('repair', { volume : 50 });
				setTimeout(function(){
					instance.pageContainer.hidePopup(instance.pageContainer.STUCK_POPUP);
					instance.resetToCheckpoint();
					racePage.resetHealth();
					Utilities.fadeSoundOut('repair');
				}, duration*1000 );
			}
		} else {
			this.gameOver();
		}
	},

	oemRepairCar: function() {
		this.stop(true);

		var racePage = window.main.pages[window.main.RACE_PAGE];

		if ( this.pageContainer )
		{
			this.pageContainer.showPopup(this.pageContainer.OEM_REPAIRS_POPUP, this.OEM_REPAIR_DURATION);
			var instance = this;
			soundManager.play('repair', { volume : 50 });
			setTimeout(function(){
				instance.pageContainer.hidePopup(instance.pageContainer.OEM_REPAIRS_POPUP);
				instance.resetToCheckpoint();
				racePage.resetHealth();
				Utilities.fadeSoundOut('repair');
				//instance.reset();
				//instance.startGame();
			}, this.OEM_REPAIR_DURATION*1000 );
		}
	},

	findNearestCheckpoint: function() {		
		var closestCheckpoint = new Object();
		closestCheckpoint.x = this.car.initialX;
		closestCheckpoint.y = this.car.initialY;

		var carPos = this.car.getPosition();

		for( var i = 0; i < this.checkpoints.length; i++ )
		{
			if( this.checkpoints[i].x < carPos.x )
			{
				if( closestCheckpoint.x == this.car.initialX )
				{
					closestCheckpoint.x = this.checkpoints[i].x;
					closestCheckpoint.y = this.checkpoints[i].y;
				} else {
					if( ( carPos.x - this.checkpoints[i].x ) < ( carPos.x - closestCheckpoint.x ) )
					{
						closestCheckpoint.x = this.checkpoints[i].x;
						closestCheckpoint.y = this.checkpoints[i].y;
					}
				}
			}
		}

		return closestCheckpoint;
	},

	resetToCheckpoint: function() {
		var cp = this.findNearestCheckpoint();
		var world = this.renderer.getLayer('world');

		this.car.setLocation( cp.x, cp.y );

		world.x = -cp.x + 200;
		world.y = -cp.y + 200;

		if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
			this.resumeFromOem();
		else
			this.resumeFromNonOem();
	},

	updateProperties: function(gravity, pbrakingAmountX, pbrakingAmountY, pbrakingInterval) {
//		console.log("Update Properties");
		this.brakingAmount_x = pbrakingAmountX;
		this.brakingAmount_y = pbrakingAmountY;
		this.brakeIntervalAmount = pbrakingInterval;
		JPE.Engine.resetMasslessForce();
		this.gravity = gravity
		JPE.Engine.addMasslessForce(new JPE.Vector(0, this.gravity));
	},

	uploadAllProperties: function(data,userData) {
		if( userData == null ) 
		{
//			console.log("uploadAllProperties");
			var carData = data.physics.car;
			this.updateProperties(data.physics.world.gravity, carData.braking_amount_x, carData.braking_amount_y, carData.braking_interval);
			this.car.updateProperties(carData.mass, carData.elasticity, carData.friction, carData.traction, carData.max_speed);
		} else {
//			console.log("uploadAllProperties via userData");
			this.updateProperties(userData.world_gravity, userData.car_brake_amount.x, userData.car_brake_amount.y, userData.car_brake_interval);
			this.car.updateProperties(userData.car_mass, userData.car_elasticity, userData.car_friction, userData.car_traction, userData.car_max_speed, userData.car_durability);
		}
	},

	exportWorldProperties: function() {
		var rootObject =  new Object();
		rootObject.physics = new Object();
		rootObject.physics.car = new Object();
		rootObject.physics.car.braking_amount_x = this.brakingAmount_x;
		rootObject.physics.car.braking_amount_y = this.brakingAmount_y;
		rootObject.physics.car.braking_interval = this.brakeIntervalAmount;
		rootObject.physics.car.mass = this.car.getMass();
		rootObject.physics.car.elasticity = this.car.getElasticity();
		rootObject.physics.car.friction = this.car.getFriction();
		rootObject.physics.car.traction = this.car.getTraction();
		rootObject.physics.car.max_speed = this.car.getMaxSpeed();

		rootObject.physics.world = new Object();
		rootObject.physics.world.gravity = this.gravity;

		return JSON.stringify(rootObject);
	},

	wasBrakeHintingSuccess: function() {
		var zoneLength = this.brakeZones[this.currentBrakeZone].xEnd - this.brakeZones[this.currentBrakeZone].xStart;
		var brakeLength = this.brakeStartXEnd - this.brakeStartXPos;

		var zone = this.brakeZones[this.currentBrakeZone];
		var brakeDistance = ( this.brakeStartXEnd - this.brakeStartXPos ) / ( this.brakeStartYEnd - this.brakeStartYPos );
		var zoneDistance = ( zone.xEnd - zone.xStart ) / ( zone.yEnd - zone.yStart );
		var brakePercentage = brakeDistance / zoneDistance;

		if( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
		{
			if( this.brakeStartXPos > this.brakeZones[this.currentBrakeZone].xStart && this.brakeStartXEnd < this.brakeZones[this.currentBrakeZone].xEnd )
			{	
				if( brakePercentage > zone.percentage )
				{
					this.brakeHintingSuccess();
//					console.log( 'Brake in Zone Success! - zone: ' + this.currentBrakeZone );
				}
			} 
		}
	},

	brakeHintingSuccess: function() {
		var instance = this;

		this.car.setMaxSpeed(this.brakeZones[this.currentBrakeZone].velocity);

		if( this.car.wheelParticleA.getVelocity().x > this.brakeZones[this.currentBrakeZone].velocity )
		{
			this.car.setSpeed( -80, -20 );
		} else {
			this.car.setSpeed( 80, 20 );
		}

		//console.log( 'before: ' + this.car.wheelParticleA.isColliding());
		//console.log( 'after: ' + this.car.wheelParticleB.isColliding());

		if( this.car.wheelParticleA.isColliding() || this.car.wheelParticleB.isColliding() )
		{
			setTimeout( function(){ instance.brakeHintingSuccess(); }, 50);
			// console.log(this.car.wheelParticleA.isColliding() );
			// console.log(this.brakeZones[this.currentBrakeZone].velocity);
			// console.log(this.car.wheelParticleA.getVelocity().x);
		} else {
			this.car.setMaxSpeed(window.main.carWorldProps.car_max_speed);
		}
	},

	keyDownHandler: function(keyEvt) {
		if (keyEvt.keyCode == 32) {
			if ( !this.brakeApplied )
			{
//				 console.log("BRAKE NOW!!!!");
				this.brakeApplied = true;
				this.brakeStartXPos = this.car.getPosition().x;
				this.brakeStartYPos = this.car.getPosition().y;
				var owner = this;
				owner.brakeInterval = setInterval(function() {
					owner.applyBrake(owner.brakingAmount_x, owner.brakingAmount_y);
				}, owner.brakeIntervalAmount);
			}
		}
	},
		
	keyUpHandler: function(keyEvt) {
		if ( keyEvt.keyCode == 32 ) {
//			 console.log("Stop Braking!");
			this.brakeApplied = false;
			this.brakeStartXEnd = this.car.getPosition().x;
			this.brakeStartYEnd = this.car.getPosition().y;
			clearInterval(this.brakeInterval);
			this.car.setSpeed(0);
		}
		this.car.setSpeed(0);

		this.wasBrakeHintingSuccess();
	},

	mouseDownHandler: function() {
		//console.log("BRAKE NOW!!!!");
		this.brakeApplied = true;
		this.brakeStartXPos = this.car.getPosition().x;
		this.brakeStartYPos = this.car.getPosition().y;
		var owner = this;
		owner.brakeInterval = setInterval(function() {
			owner.applyBrake(owner.brakingAmount_x, owner.brakingAmount_y);
		}, owner.brakeIntervalAmount);
	},

	mouseUpHandler: function() {
		//console.log("Stop Braking!");
		this.brakeApplied = false;
		this.brakeStartXEnd = this.car.getPosition().x;
		this.brakeStartYEnd = this.car.getPosition().y;
		clearInterval(this.brakeInterval);
		this.car.setSpeed(0);
		this.wasBrakeHintingSuccess();
	}
});