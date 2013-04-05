(function (window) {
	function RacePage(main) {
		this.root = null;
		this.popups = null;
		
		this.BASE_NAME = 'race-page';
		this.OEM_REPAIRS_POPUP = 'oem-repairs-popup';
		this.REPAIRS_POPUP = 'repairs-popup';
		this.GAME_OVER_POPUP = 'game-over-popup';
		this.GAME_SUCCESS_POPUP = 'game-success-popup';
		this.LEADER_BOARD_POPUP = 'leader-board-popup';
		this.LEAD_GEN_COMPLETE_POP = 'lead-gen-complete-popup';
		this.STUCK_POPUP = 'stuck-popup';

		this.oemRepairsPopup = null;
		this.repairsPopup = null;
		this.gameOverPopup = null;
		this.successPopup = null;
		this.leaderBoardPopup = null;
		this.leadGenCompletePopup = null;
		this.stuckPopup = null;

		this.repairCost = 0;

		this.healthMeter = null;
		this.isBrakeDown = false;

		this.race = null;
		this.tempButtonFlag = false;

		this.imageStartSequenceName = "images/RaceAssets/startSequence/racingLightsAnimation";
		
		this.main = main;

		this.container = null;

		Page.apply(this, arguments);
	};

	RacePage.prototype = new Page();

	RacePage.prototype.parent = Page.prototype;

	RacePage.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		
		if( !this.main.isTablet )
			this.paperOverlay = $('<div />').addClass('race-page-overlay').appendTo(this.root);

		this.loadingScreen = $('<div />').addClass('loading-screen-container').attr('id', 'loading-screen').appendTo(this.root);
		this.loadingText = $('<span />').text('Preparing Track...').appendTo(this.loadingScreen);
		this.container = $('<div />').addClass('game-asset-class').attr('id', 'game_asset_container').appendTo(this.root);
		this.popup = $('<div />').attr('id', this.BASE_NAME + '-popup-container').appendTo(this.root);
		// $('<canvas />').attr('id', 'canvas').attr('width', '984').attr('height', '558').appendTo(this.container);

		this.stuckPopup = new StuckPopup();
		this.stuckPopup.create(this.STUCK_POPUP);
		this.stuckPopup.base.appendTo(this.popup);

		this.oemRepairsPopup = new RepairPopup();
		this.oemRepairsPopup.create(this.OEM_REPAIRS_POPUP);
		//this.oemRepairsPopup.distributeContent("Repair Popup", "Left Content", "Right Content", "-$250", "this is some text explaining why we are charging you to fix your car", "Repaired In:");
		this.oemRepairsPopup.base.appendTo(this.popup);
		
		this.repairsPopup = new RepairPopup();
		this.repairsPopup.create(this.REPAIRS_POPUP);
		//this.repairsPopup.distributeContent("Repair Popup 2", "Left Content", "Right Content", "-$1250", "this is some text explaining why we are charging you to fix your car", "Repaired In:");
		this.repairsPopup.base.appendTo(this.popup);
		
		this.successPopup = new SuccessPopup();
		this.successPopup.create(this.GAME_SUCCESS_POPUP);
		//this.successPopup.distributeContent("Success Popup", "Left Content", "Right Content", "You made it to the finish line and managed to earn", "$2300!", "Continue");
		this.successPopup.base.appendTo(this.popup);

		this.gameOverPopup = new FailPopup();
		this.gameOverPopup.create(this.GAME_OVER_POPUP);
		//this.gameOverPopup.distributeContent("Fail Popup", "Left Content", "Right Content", "You suck at this game!  Try again?", "Button 1", "Button 2", "Button 3");
		this.gameOverPopup.base.appendTo(this.popup);

		// DSK
		this.healthMeterContainer = $('<div />').attr( "class", "health-container" ).appendTo(this.root);
		this.healthMeter = new HealthMeter();
		this.healthMeter.initialize();
		this.healthMeter.base.appendTo(this.healthMeterContainer);

        $("#bottom-navigation-footer").addClass("race-page");
        this.main.bottomNavigation.hide();
        //$("#bottom-navigation-footer button").remove();

        this.main.scoringSystem.setCache();

        // for( var i = 1; i < this.main.pages.length; i++ )
        // {
        // 	if( i != 7 && i != 0 && i != 2 )
        // 	{
        // 		if( this.main.pages[i].root != null )
        // 		{
        // 			this.main.pages[i].root.remove();
        // 			this.main.pages[i].isInit = false;
        // 			console.log('RacePage -- removing main.pages at index: ' + i);
        // 		}	
        // 	}
        // }
        
        var instance = this;
		//@TODO Temporary pause/resume button - FOR DEBUG ONLY, REMOVE IN PRODUCTION
		// $('<button />').addClass("pause-play").html("pause").click(function(){
		// 	if ( !instance.tempButtonFlag )
		// 	{
		// 		instance.race.stop();
		// 		$(instance.root).find('button.pause-play').html("resume");
		// 		instance.tempButtonFlag = !instance.tempButtonFlag;
		// 	}
		// 	else
		// 	{
		// 		instance.race.startGame();
		// 		$(instance.root).find('button.pause-play').html("pause");
		// 		instance.tempButtonFlag = !instance.tempButtonFlag;
		// 	}
		// 	soundManager.play('button_press');

		// }).appendTo(this.root);

// 		 $('<button />').addClass("debug-gameover").html("game over").click(function(){
// 		 	instance.race.gameOver();
// 		 }).appendTo(this.root);

		// $('<button />').addClass("debug-addmoney").html("add money").click(function(){
		// 	instance.main.scoringSystem.addOperatingCosts(-5000);
		// }).appendTo(this.root);

		var frameActions = new ImageActions();

		frameActions.addAction( 61, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 80, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 100, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 120, function(){ soundManager.play('countdown_go'); });

		var instance = this;
		this.race = new JPE.Root('json/fu_level.json', 'json/game_properties.json', 'json/world_properties.json', this.container, this, function() {
//			console.log("On Game Loaded!!!");

			// Fade Build Music Out over 1 second
			if ( $.client.os != "iPad" )
			{
				Utilities.fadeSoundOut('music_build');
			}

			// Fade Loading Screen Out and start game
            // var total_images = 10;			// for DEBUG
			var total_images = 140;				// for PROD

			setTimeout( function(){
				instance.main.bottomNavigation.show();
				instance.loadingScreen.transition({ 'opacity' : 0 }, 1000, function(){
					$(this).detach();

					var goGame = function() {
						$('#'+instance.BASE_NAME+'-race-lights').transition({ 'opacity' : 0 }, 100, function(){ $(this).detach(); });
						instance.race.gameProperties.repairCost = instance.repairCost;
						console.log("*************** SERVER ANALYTICS - SENDING... ***************");
		                console.log("URL: api/analytics/create/stat/");
		                console.log("Key: Races Started");
						$.ajax({
				            type: "GET",
				            url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
				 			dataType: "jsonp",
				            data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_RACES_STARTED, value:"1", platform:$.client.os, os:$.client.browser },
				 			callback: 'jsonp',
				            success: function(data) {
				 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
		                        console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
		                        console.log("Key: Races Started");
		                        console.log("*************** SERVER ANALYTICS - END ***************");
				            }
				        });
						instance.race.startGame();
						soundManager.play('gate');
						//instance.race.gameSuccess(); // FOR DEBUG ONLY - REMOVE WHEN LIVE
						if ( $.client.os != "iPad" )
						{
							soundManager.play('music_race', { loops : 20, volume : 100 });	
						}

						$('.brake-button-left').css('z-index', 2);
						$('.brake-button-right').css('z-index', 2);				
					};
					if( $.browser.mozilla || instance.main.isTablet || $.browser.msie ) {
						// We haven't figured out why, but in FireFox, the race start animation flickers horribly.
						// ...For now, skip the animation and start the game going.
						// ...Tablets are just slow, skip them too
						goGame();
					} else {
						// if it's not FireFox or a tablet, run the animation, and get the game going on completion
						var img = new ImageSequenizer(instance.imageStartSequenceName , ".png", total_images, false, true, 24, instance.BASE_NAME + '-race-lights', function(){
							goGame();
						}, null, frameActions);
		
						img.getElement().appendTo(instance.root);
					}
				});
			}, 1000);
		});
			
		this.race.setContainer(this);
	};

	RacePage.prototype.reset = function() { 
		this.loadingScreen.appendTo(this.root).css({ 'opacity' : 1 });
		this.resetHealth();
		this.race.reset();
	};

	RacePage.prototype.freshStart = function() {
		this.main.scoringSystem.setCache();

		$("#bottom-navigation-footer").addClass("race-page");
        this.main.bottomNavigation.hide();

		var frameActions = new ImageActions();

		frameActions.addAction( 61, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 80, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 100, function(){ soundManager.play('countdown_pre'); });
		frameActions.addAction( 120, function(){ soundManager.play('countdown_go'); });

		// Fade Build Music Out over 1 second
		if ( $.client.os != "iPad" )
		{
			Utilities.fadeSoundOut('music_build');
		}
		// Fade Loading Screen Out and start game
		// var total_images = 10;			// for DEBUG
		var total_images = 140;				// for PROD
		var instance = this;

		if( this.race.isInit )
			this.race.freshStart();

		setTimeout( function(){
			instance.main.bottomNavigation.show();
			instance.loadingScreen.transition({ 'opacity' : 0 }, 1000, function(){
				$(this).detach();

				var goGame = function() {
					$('#'+instance.BASE_NAME+'-race-lights').transition({ 'opacity' : 0 }, 100, function(){ $(this).detach(); });
					instance.race.gameProperties.repairCost = instance.repairCost;
					console.log("*************** SERVER ANALYTICS - SENDING... ***************");
	                console.log("URL: api/analytics/create/stat/");
	                console.log("Key: Races Started");
					$.ajax({
			            type: "GET",
			            url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
			 			dataType: "jsonp",
			            data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_RACES_STARTED, value:"1", platform:$.client.os, os:$.client.browser },
			 			callback: 'jsonp',
			            success: function(data) {
			 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
	                        console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
	                        console.log("Key: Races Started");
	                        console.log("*************** SERVER ANALYTICS - END ***************");
			            }
			        });
					instance.race.startGame();
					soundManager.play('gate');
					//instance.race.gameSuccess(); // FOR DEBUG ONLY - REMOVE WHEN LIVE
					if ( $.client.os != "iPad" )
					{
						soundManager.play('music_race', { loops : 20, volume : 100 });	
					}
					$('.brake-button-left').css('z-index', 2);
					$('.brake-button-right').css('z-index', 2);				
				};
				if( $.browser.mozilla || instance.main.isTablet || $.browser.msie ) {
					// We haven't figured out why, but in FireFox, the race start animation flickers horribly.
					// ...For now, skip the animation and start the game going.
					// ...Tablets are just slow, skip them too
					goGame();
				} else {
					// if it's not FireFox or a tablet, run the animation, and get the game going on completion
					var img = new ImageSequenizer(instance.imageStartSequenceName , ".png", total_images, false, true, 24, instance.BASE_NAME + '-race-lights', function(){
						goGame();
					}, null, frameActions);
	
					img.getElement().appendTo(instance.root);
				}
			});
		}, 1000);
	};

	RacePage.prototype.showPopup = function(attrid, duration) {
		var instance = this;

		$('#touch-button-left').css('z-index', 0);
		$('#touch-button-right').css('z-index', 0);

		var pu = $('#'+attrid);
		// preset the duration in the text field
		pu.find('.countdown').text( duration);

		pu.fadeIn(250, function() {
			switch(attrid)
			{
				case instance.REPAIRS_POPUP:
					// Countdown the Repairs popup
					Utilities.countdown(pu.find('.countdown'), duration);
					return;
				case instance.OEM_REPAIRS_POPUP:
					// Countdown the OEM Repairs popup
					Utilities.countdown(pu.find('.countdown'), duration);
					return;
				case instance.GAME_OVER_POPUP:
					return;
				case instance.GAME_SUCCESS_POPUP:
					pu.find('span').text(instance.main.CURRENCY_SYMBOL + instance.main.scoringSystem.getRevenue());
					return;
				case instance.LEADER_BOARD_POPUP:
					return;
				case instance.LEAD_GEN_COMPLETE_POP:
					return;
				case instance.STUCK_POPUP:
					// Countdown the OEM Repairs popup
					Utilities.countdown(pu.find('.countdown'), duration);
					return;
			}
		});
	};

	RacePage.prototype.hidePopup = function(attrid) {
		$('#'+attrid).fadeOut(250);

		$('.brake-button-left').css('z-index',2);
		$('.brake-button-right').css('z-index',2);
	};

	RacePage.prototype.activate = function() {
		var instance = this;

		this.main.bottomNavigation.hideGoButton();
        this.main.bottomNavigation.hidePreviousButton();

		$('#footer-previous-button').unbind('click');
		$('#footer-previous-button').click(function(){
			instance.main.navigateBackward(instance, instance.main.BUILD_CONFIRMATIONf_PAGE);
			soundManager.play('button_press');
		});
	};

	RacePage.prototype.distributeContent = function(content) {
		if ( this.root != null && this.main.gameLoadedComplete )
		{
			//this.main.bottomNavigation.hideGoButton();
			//this.main.bottomNavigation.hidePreviousButton();

			var content = content.popups;
			// $('#'+this.BASE_NAME+'-popup-title-'+this.REPAIRS_POPUP).text(content.race_repair.non_oem.title);
			// $('#'+this.REPAIRS_POPUP + '-cost').text('-'+this.main.CURRENCY_SYMBOL + content.race_repair.non_oem.cost);
			// $('#'+this.REPAIRS_POPUP + '-repaired-in-title').text(content.race_repair.non_oem.explanation);
			// $('#'+this.REPAIRS_POPUP + '-repaired-in-title').text(content.race_repair.non_oem.countdown_title);
			this.repairCost = parseInt(content.race_repair.cost);

			this.oemRepairsPopup.distributeContent(content.oem_race_repair);
			this.repairsPopup.distributeContent(content.race_repair);
			this.successPopup.distributeContent(content.race_win);
			this.gameOverPopup.distributeContent(content.race_lose);
			this.stuckPopup.distributeContent(content.stuck_pane);
	
//			if( $.client.os == 'Android' || $.client.os == 'iPad' )
			if (this.main.isTablet)
			{
				this.createBrakeButtons();
			}
		}
	};

	RacePage.prototype.subtractHealth = function () {
		return this.healthMeter.subtractHealth();
	};

	RacePage.prototype.resetHealth = function () {
		this.healthMeter.reset();
	};

	RacePage.prototype.attach = function() {
        this.root.appendTo('#main-wrapper-content-body');
		
        $(document).on("keydown", "body", function(e){
            if(e.keyCode == 32){
                e.preventDefault();
            }
        });

       	var ele = document.querySelector('#' + this.BASE_NAME + "-content-body");
       	ele.addEventListener('contextmenu', function(e){ e.preventDefault(); });
	};

	RacePage.prototype.detach = function() {
        $(document).off("keydown", "body");
		this.reset();

		this.hidePopup(this.REPAIRS_POPUP);
		this.hidePopup(this.GAME_OVER_POPUP);
		this.hidePopup(this.GAME_SUCCESS_POPUP);
		this.hidePopup(this.LEADER_BOARD_POPUP);
		this.hidePopup(this.LEAD_GEN_COMPLETE_POP);

		this.root.detach();
	};

	// iPad Brake Buttons, for whatever reason the 'touchstart' and 'touchend' devices don't want to be
	// bound to the button using $(...).bind(), so DSK had to revert to using addEventListener to use javascript
	// built in events to prevent adding more libraries.
	RacePage.prototype.createBrakeButtons = function() {
		var instance = this;

		$('<button />').addClass('brake-button-left').attr({'id' : 'touch-button-left'}).appendTo(this.root);

		var buttonLeft = document.getElementById('touch-button-left');

		buttonLeft.addEventListener('touchstart',function()
		{ 
			$(instance.root).find('button.brake-button-left').removeClass('brake-button-left').addClass('brake-button-left-down');
			$(instance.root).find('button.brake-button-right').removeClass('brake-button-right').addClass('brake-button-right-down');
			if( !instance.isBrakeDown )
			{
				instance.isBrakeDown = true;
				instance.race.mouseDownHandler();
			}
		});

		buttonLeft.addEventListener('touchend', function(){
			instance.isBrakeDown = false;
			instance.race.mouseUpHandler();
			$(instance.root).find('button.brake-button-left-down').removeClass('brake-button-left-down').addClass('brake-button-left');
			$(instance.root).find('button.brake-button-right-down').removeClass('brake-button-right-down').addClass('brake-button-right');
		});

		$('<button />').addClass('brake-button-right').attr({'id' : 'touch-button-right'}).appendTo(this.root);

		var buttonRight = document.getElementById('touch-button-right');

		buttonRight.addEventListener('touchstart', function(){
			$(instance.root).find('button.brake-button-right').removeClass('brake-button-right').addClass('brake-button-right-down');
			$(instance.root).find('button.brake-button-left').removeClass('brake-button-left').addClass('brake-button-left-down');
			if( !instance.isBrakeDown )
			{
				instance.isBrakeDown = true;
				instance.race.mouseDownHandler();
			}
		});

		buttonRight.addEventListener('touchend', function(){
//			console.log("MOUSE UP");
			instance.isBrakeDown = false;
			instance.race.mouseUpHandler();
			$(instance.root).find('button.brake-button-right-down').removeClass('brake-button-right-down').addClass('brake-button-right');
			$(instance.root).find('button.brake-button-left-down').removeClass('brake-button-left-down').addClass('brake-button-left');
		});
	}

	window.RacePage = RacePage;

} (window));