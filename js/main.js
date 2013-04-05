(function (window) {

	var JSON_CONTENT_FILE 				= "json/content.json";
	var JSON_SOUND_FILE 				= "json/sounds.json";
	var SOUNDS_DIRECTORY 				= "media/sounds/";
	var jsonContent 					= null;

	function Main() {
		
		if( !$.support.transition) {
//			console.log('setting transition to animate');
			$.fn.transition = $.fn.animate;
		}
		
		Compatibility.run();

		if( $.browser.mozilla )
			$.fn.transition = $.fn.animate;
			
		if ( Modernizr.hasEvent('touchstart') )  {
			this.isTablet = true;
		} else {
			this.isTablet = false;
		}

		// LOCAL SERVERS FOR DEV
		// this.SERVER_URL 					= "http://ploetz.local:8000/";
		// this.API_KEY 						= "ca582d0f-1af6-4d09-aa98-2b6011925276";
		// this.PROJECT_KEY					= "7ee73c43-c237-4a80-ace9-9d6e5cb84fda";

		// LIVE SERVERS
		this.SERVER_URL						= "http://ec2-107-22-86-112.compute-1.amazonaws.com/";
		this.API_KEY 						= "ffcd50fa-f298-4ae1-bd9c-38bc439cc2a1";
		this.PROJECT_KEY 					= "936ad22d-13c0-45f2-b1b5-bf018074e692";

		this.USER_KEY						= "";
		this.UNIQUE_RANK_ID					= "";
		this.USERS_RANK 					= 1;
		this.LEADERBOARD_SCORES				= null;
		this.LEADERBOARD_TOP_TEN			= null;

		this.KEY_TOTAL_OEM_PATH				= "total_oem_path";
		this.KEY_TOTAL_CUSTOM_PATH			= "total_custom_path";
		this.KEY_TOTAL_OFF_THE_SHELF_PATH 	= "total_off_the_shelf_path";
		this.KEY_OVERALL_PAGE_LOADS			= "overall_page_loads";
		this.KEY_RACES_STARTED				= "races_started";
		this.KEY_RACES_ENDED				= "races_ended";
		this.KEY_CONCLUSION_PAGE			= "conclusion_page";
		this.KEY_TOTAL_OEM_BLOG_LINK_CLICKS	= "total_oem_blog_link_clicks";
		this.KEY_RACE_LENGTH				= "race_length";
		this.KEY_CONTINUE_CLICKED			= "continue_clicked";
		this.KEY_RACES_ENDED_GAME_OVER		= "races_ended_game_over";
		this.KEY_RACES_ENDED_GAME_SUCCESS	= "races_ended_game_success";
		
		var instance = this;

		this.CURRENCY_SYMBOL = '';

		this.LOADING_PAGE 						= 0;
		this.LANDING_PAGE 						= 1;
		this.REEL_PAGE 							= 2;
		this.BUILD_PATH_SELECTION_PAGE 			= 3;
		this.OFF_THE_SHELF_PAGE 				= 4;
		this.MODIFICATIONS_PAGE 				= 5;
		this.BUILD_CONFIRMATION_PAGE 			= 6;
		this.RACE_PAGE 							= 7;
		this.CUSTOM_BUILD_CHASSIS 				= 8;
		this.CUSTOM_BUILD_WHEELS 				= 9;
		this.CUSTOM_BUILD_BRAKES 				= 10;
		this.OEM_BUILD_CHASSIS 					= 11;
		this.OEM_BUILD_WHEELS 					= 12;
		this.OEM_BUILD_BRAKES 					= 13;
		this.METAPHOR_PAGE 						= 14;
		this.CONCLUSION_PAGE 					= 15;
		this.TUTORIAL1							= 16;
		this.TUTORIAL1_TABLET					= 17;
		this.TUTORIAL2							= 18;
		this.TUTORIAL3							= 19;
		this.TUTORIAL4							= 20;
		this.TUTORIAL4_TABLET					= 21;
		this.MARKETING_PAGE                     = 22;
		this.REDIRECT_PAGE						= 23;
		
		this.currentLocation = this.LANDING_PAGE;

		this.bottomNavigation = new BottomNavigation(this);

		this.pages = new Array();

		this.carData = CarData(this);

		this.marquee = null;
		this.marqueeTracker = new Array();

		this.inTransition = false;

		this.pages[this.LANDING_PAGE] = new LandingPage(this);
		this.pages[this.BUILD_PATH_SELECTION_PAGE] = new BuildPathPage(this);
		this.pages[this.OFF_THE_SHELF_PAGE] = new OffTheShelfPage(this);
		this.pages[this.MODIFICATIONS_PAGE] = new ModificationsPage(this);
		this.pages[this.BUILD_CONFIRMATION_PAGE] = new BuildConfirmationPage(this);
		this.pages[this.RACE_PAGE] = new RacePage(this);
		this.pages[this.CUSTOM_BUILD_CHASSIS] = new CustomBuildChassis(this);
		this.pages[this.CUSTOM_BUILD_WHEELS] = new CustomBuildWheels(this);
		this.pages[this.CUSTOM_BUILD_BRAKES] = new CustomBuildBrakes(this);
		this.pages[this.OEM_BUILD_CHASSIS] = new OEMBuildChassis(this);
		this.pages[this.OEM_BUILD_WHEELS] = new OEMBuildWheels(this);
		this.pages[this.OEM_BUILD_BRAKES] = new OEMBuildBrakes(this);
		this.pages[this.METAPHOR_PAGE] = new MetaphorPage(this);
		this.pages[this.CONCLUSION_PAGE] = new ConclusionPage(this);
		this.pages[this.TUTORIAL1] = new Tutorial1(this);
		this.pages[this.TUTORIAL1_TABLET] = new Tutorial1Tablet(this);
		this.pages[this.TUTORIAL2] = new Tutorial2(this);
		this.pages[this.TUTORIAL3] = new Tutorial3(this);
		this.pages[this.TUTORIAL4] = new Tutorial4(this);
		this.pages[this.TUTORIAL4_TABLET] = new Tutorial4Tablet(this);
		this.pages[this.MARKETING_PAGE] = new MarketingPage(this);
		this.pages[this.REDIRECT_PAGE] = new RedirectPage(this);

		this.BUILD_TYPE_OFF_THE_SHELF_A 		= 'offtheshelf';
		this.BUILD_TYPE_OFF_THE_SHELF_B 		= 'offtheshelf';
		this.BUILD_TYPE_OEM 					= 'oem';
		this.BUILD_TYPE_CUSTOM	 				= 'custom';

		// GAME LOADING QUEUE FOR SOURCE FILES - NEEDS MIMIFYING BEFORE DEPLOYING
		var queue = ['JPE', 'Signal', 'Engine', 'Vector', 'Interval', 'Collision', 'SmashSignal',
                'MathUtil', 'AbstractItem', 'CollisionResolver', 'CollisionDetector', 'AbstractCollection', 'AbstractParticle', 'Group',
                'Composite', 'CircleParticle', 'RectangleParticle', 'RimParticle', 'WheelParticle', 'AbstractConstraint',
                'SpringConstraint', 'SpringConstraintParticle', 'Renderer', 'EaselRenderer', 'EdgeParticle', 'FollowerParticle'];
            
        for(var i = 0, l = queue.length; i < l; i++)
        {
            queue[i] = "js/lib/JPE/src/" + queue[i] + ".js";
        }
            
        queue.push("js/game/CssImage.js");
        queue.push("js/game/CssLayer.js");
        queue.push("js/game/CssGameRenderer.js");
        queue.push("js/game/Car.js");
        queue.push("js/game/Surfaces.js");
        queue.push("js/game/Root.js");
        queue.push("js/game/CssAnimation.js");
        queue.push("js/game/Collobsticle.js");
        queue.push("js/game/Collectable.js");
		queue.push("js/game/Collections.js");
		queue.push("js/game/Obstacle.js");
		queue.push("js/game/GameProperties.js");
		queue.push("js/game/Item.js");
		queue.push("js/game/User.js");
		queue.push("js/game/HealthMeter.js");
		queue.push("js/game/GameRenderer.js");
		queue.push("js/game/ImageResources.js");
		queue.push("js/game/DynamicForeground.js");
		queue.push("js/game/Rect.js");

        var owner = this;
        this.gameLoadedComplete = false;

        // initialize the sound manager 
        soundManager.url = 'js/lib/soundManager2/'; 
        soundManager.flashVersion = 9; 
        soundManager.usehighPerformance = true; // reduces delays 
         
        // reduce the default 1 sec delay to 500 ms 
        soundManager.flashLoadTimeout = 500; 
         
        soundManager.audioFormats.mp3.required = false; 

        soundManager.debugMode = true;
         
        // flash may timeout if not installed or when flashblock is installed 
        soundManager.ontimeout(function(status) { 
            // no flash, go with HTML5 audio 
            soundManager.useHTML5Audio = true; 
            soundManager.preferFlash = false; 
            soundManager.reboot(); 
        }); 

        var instance = this;
         
        soundManager.onready(function() { 
            //console.log("soundManager ready, loading sounds");
            instance.loadSounds();

            console.log("*************** SERVER ANALYTICS - SENDING... ***************");
            console.log("URL: api/generate/user/");
            $.ajax({
	            type: "GET",
	            url: instance.SERVER_URL + "api/generate/user/", 
	 			async: false,
	 			dataType: "jsonp",
	            data: { api_key: instance.API_KEY, project_key: instance.PROJECT_KEY },
	 			callback: 'jsonp',
	            success: function(data) {
	 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
	 				console.log("api/generate/user/ - USER_ID: " + data.USER_ID);
	 				console.log("*************** SERVER ANALYTICS - CAPTURED ***************");
	 				instance.USER_KEY = data.USER_ID;
	 				console.log("*************** SERVER ANALYTICS - SENDING... ***************");
        			console.log("URL: api/analytics/create/stat/");
        			console.log("Key: Overall Page Loads");
	 				$.ajax({
			            type: "GET",
			            url: instance.SERVER_URL + "api/analytics/create/stat/", 
			 			async: false,
			 			dataType: "jsonp",
			            data: { api_key: instance.API_KEY, project_key: instance.PROJECT_KEY, user: instance.USER_KEY, key: instance.KEY_OVERALL_PAGE_LOADS, value:"1", platform:$.client.os, os:$.client.browser },
			 			callback: 'jsonp',
			            success: function(data) {
			 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
			 				console.log("api/analytics/create/stat/  - SUCCESS: " + data.SUCCESS);
			 				console.log("Key: Overall Page Loads");
			 				console.log("*************** SERVER ANALYTICS - END ***************");
			            }
			        });
	            }
	        });
        });
        
        // set a variable to track mute-state
        this.isMuted = false;
		// Load World Properties Table
		this.worldPropTable = new WorldPropertiesTable();

		// Load Parts ( Chassis, Wheels, Brakes, etc. )
		this.parts = new Parts();

		// Load Build Configurations (off_the_shelf,etc)
		this.buildConfigs = new Array();

		// Car Build Object, used to store user selection and calculate world Properties
		// before entering into RacePage.js
		this.carBuild = new CarBuild();

		// Final World Properties Object, used to store user calculated Car Build
		this.carWorldProps = null;

        yepnope({
            load: queue,
            complete: function(){
                //root = new JPE.Root();
                owner.gameLoadedComplete = true;

                // load this.worldProps, chains to load this.parts, chains to load this.buildConfigs
                owner.loadWorldPropertiesTable('json/world_properties_table.json');

                JPE.clone();
            }
        });

        this.scoringSystem = new ScoringSystem();

		this.loadContent();
		
	};

	// DSK CHANGES START
	Main.prototype.loadSounds = function() {
		//console.log("loading sounds");
		var instance = this;
		var loader = new PxLoader();

		$.ajax({
			url: JSON_SOUND_FILE,
			async: false,
			dataType: "json",
			success: function(data)
			{
				var url;
				for( var i=0; i < data.sounds.length; i++ )
				{
					url = SOUNDS_DIRECTORY + data.sounds[i].src + '.mp3';
					if( !soundManager.canPlayURL( url ) )
					{
						url = SOUNDS_DIRECTORY + data.sounds[i].src + '.ogg';
						if( !soundManager.canPlayURL( url ) )
						{
							continue;
						}
					}
					//console.log("soundManager -- adding " + data.sounds[i].id + " to PxLoaderSounds");
					loader.addSound(data.sounds[i].id, url);
				}
			}
		});

		loader.start();
		if ( $.client.os != "iPad" )
		{
			soundManager.play('music_build', { loops: 100 } );
		}
	};

	Main.prototype.loadContent = function() {
//		console.log("Load Content");
		var instance = this;
		$.ajax({
			url: JSON_CONTENT_FILE,
			async: false,
			dataType: "json",
			success: function(data) 
			{
//				console.log("data: " + data);
				instance.jsonContent = data;
				instance.distributeBibContent();

				if( $.browser.msie )
				{
					if( $.browser.version < 10 )
					{
						instance.pages[instance.REDIRECT_PAGE].create();
						instance.pages[instance.REDIRECT_PAGE].attach();
						instance.pages[instance.REDIRECT_PAGE].distributeContent(instance.jsonContent.redirect_page);
						$('#main-wrapper').removeClass('intro').addClass('redirect');

						return;
					}
				}
				if( $.browser.opera || $.client.os == 'iPhone/iPod' )//  || $.client.browser == 'Chrome' )
				{
					instance.pages[instance.REDIRECT_PAGE].create();
					instance.pages[instance.REDIRECT_PAGE].attach();
					instance.pages[instance.REDIRECT_PAGE].distributeContent(instance.jsonContent.redirect_page)
					$('#main-wrapper').removeClass('intro').addClass('redirect');

					return;
				}
				instance.pages[instance.LANDING_PAGE].create();
				instance.pages[instance.LANDING_PAGE].attach();
				instance.pages[instance.LANDING_PAGE].distributeContent(instance.jsonContent.landing_page);
			}
		});
	};

	Main.prototype.loadWorldPropertiesTable = function(jsonFile) {
//		console.log("Load World Properties Table - " + jsonFile);
		var instance = this;
		$.ajax({
			url: jsonFile,
			async: false,
			dataType: "json",
			success: function(data)
			{
				var obj;
				for( var i = 0; i < 10; i++ )
				{
					obj = new Object();
					obj.x = parseFloat(data.car_brake_amount[i].x);
					obj.y = parseFloat(data.car_brake_amount[i].y);
					instance.worldPropTable.car_brake_amount[i] = obj;
					instance.worldPropTable.car_brake_interval[i] = parseFloat(data.car_brake_interval[i]);
					instance.worldPropTable.car_mass[i] = parseFloat(data.car_mass[i]);
					instance.worldPropTable.car_elasticity[i] = parseFloat(data.car_elasticity[i]);
					instance.worldPropTable.car_durability[i] = parseFloat(data.car_durability[i]);
					instance.worldPropTable.car_friction[i] = parseFloat(data.car_friction[i]);
					instance.worldPropTable.car_traction[i] = parseFloat(data.car_traction[i]);
					instance.worldPropTable.car_max_speed[i] = parseFloat(data.car_max_speed[i]);
					instance.worldPropTable.world_gravity[i] = parseFloat(data.world_gravity[i]);
				}
				instance.loadParts('json/car_data.json');
				//console.log(instance.worldPropTable);
			}
		});
	};

	// Loads Part information, then loads Builds information since sharing same JSON.
	Main.prototype.loadParts = function(jsonFile) {
//		console.log("Load Parts - " + jsonFile );
		var instance = this;
		$.ajax({
			url: jsonFile,
			async: false,
			dataType: "json",
			success: function(data)
			{
				var obj;
				for( var i = 0; i < data.chassis.length; i++ )
				{
					obj = data.chassis[i];
					instance.parts.chassis[i] = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);
				} 
				for( var i = 0; i < data.wheels.length; i++ )
				{
					obj = data.wheels[i];
					instance.parts.wheels[i] = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);
				}
				for( var i = 0; i < data.brakes.length; i++ )
				{
					obj = data.brakes[i];
					instance.parts.brakes[i] = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);
				}

				obj = data.spoiler;
				instance.parts.spoiler = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);

				obj = data.shocks;
				instance.parts.shocks = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);

				obj = data.roll_bar;
				instance.parts.roll_bar = new Part(obj.type,obj.speed,obj.durability,obj.handling,obj.braking,obj.cost);

				instance.loadBuildConfigs(data);
			}
		});
	};

	Main.prototype.loadBuildConfigs = function(data){
//		console.log("Load Builds - " + data);
		var instance = this;

		var obj;
		for( var i = 0; i < data.builds.length; i++ )
		{
			obj = data.builds[i];
			instance.buildConfigs[data.builds[i].type] = new BuildConfiguration(obj.type,obj.chassis,obj.wheels,obj.brakes,obj.repair_cost);
		}
		//console.log(instance.buildConfigs);
	};
	// DSK CHANGES END

	Main.prototype.distributeBibContent = function() {
//		console.log("Distribute Bib Content");
		this.CURRENCY_SYMBOL = this.jsonContent.currency_symbol;

		var bitContent = this.jsonContent.bib;
		//$('#oem_messaging_crawl').text(bitContent.oem_messaging_crawl[Somnio.getRandomInt(0,bitContent.oem_messaging_crawl.length-1)]);

		this.marquee = $('.marquee').find('div');

		this.setMarqueeText(bitContent);
		
		$('#dell_blog').attr({
			'href': bitContent.dell_blog.link
		}).text(bitContent.dell_blog.name);
		
		$('#dell_oem').attr({
			'href': bitContent.oem_link.link
		}).text(bitContent.oem_link.name);

		$('#copyright').text(bitContent.footer.copyright);
		$('#sponsored-by').text(bitContent.footer.sponsored);
		$('#developed-by').text(bitContent.footer.developed);
		$('#mute-btn').click( function() {
			if(this.isMuted) {
				soundManager.unmuteAll();
				$('#mute-btn').removeClass('disabled');
				this.isMuted = false
			} else {
				soundManager.muteAll();
				$('#mute-btn').addClass('disabled');
				this.isMuted = true;
			}
		});
	};

	// Set text randomly from messaging crawl bucket
	Main.prototype.setMarqueeText = function(content) {
		var instance = this;

		if( this.marqueeTracker.length == content.oem_messaging_crawl.length )
		{
			this.marqueeTracker = null;
			this.marqueeTracker = new Array();
		}

		var t = Somnio.getRandomInt(0, content.oem_messaging_crawl.length-1);

		if( $.inArray(t, this.marqueeTracker) == -1 )
		{
			this.marqueeTracker.push(t);

			this.marquee.text(content.oem_messaging_crawl[t]);
			this.marquee.css({'left' : '984px' });
			this.marquee.transition({ 'left' : '-' + instance.marquee.css('width'), 'easing' : 'linear' }, 20000, function(){
				instance.setMarqueeText(content);
			})
		} else {
			this.setMarqueeText(content);
		}
	};

	Main.prototype.navigateForward = function(currentPage, nextPage, args) {
		var instance = this;

		if( !instance.inTransition )
		{
			instance.inTransition = true;
		
			if ( nextPage == this.BUILD_PATH_SELECTION_PAGE )
			{
				$('#main-wrapper-content').transition({ opacity : 0 }, 250, function(){
					$('#main-wrapper').removeClass('intro');
					$('#main-wrapper').removeClass('redirect');
					
					//nextPage = instance.MARKETING_PAGE; //REMOVE LINE -- FOR DEBUG ONLY
					instance.currentLocation = nextPage;
					currentPage.detach();
					var nextInstance = instance.pages[nextPage];
					nextInstance.create();
					nextInstance.root.addClass("page-content-wrapper");
					nextInstance.attach();
					nextInstance.distributeContent(instance.jsonContent.build_path_page);
					instance.bottomNavigation.create();
					instance.bottomNavigation.attach();
					instance.bottomNavigation.distributeContent(instance.jsonContent.page_bottom_footer);
					$('#main-wrapper-content').css({opacity : 0}).transition({ opacity : 1 }, 250, function() {
						if ( nextInstance.activate != null )
						{
							nextInstance.activate();
						}
						instance.inTransition = false;
					});
				} );
				return;
			}

	        //Create nav-pane & Change nav-pane color	
			if(nextPage == this.OEM_BUILD_CHASSIS || nextPage == this.CUSTOM_BUILD_CHASSIS || nextPage == this.OFF_THE_SHELF_PAGE){
	            Utilities.createNavigationPane(currentPage, instance.jsonContent.popups.nav_pane);
	            Utilities.changeNavigationPaneCss(instance.pages[nextPage].BASE_NAME);
			}
			
	        //Change nav-pane color
			if(nextPage == this.MODIFICATIONS_PAGE){
	            Utilities.changeNavigationPaneCss(instance.pages[nextPage].BASE_NAME);
			}
			
	        //Change nav-pane icon
			if(nextPage == this.BUILD_CONFIRMATION_PAGE){
	            Utilities.changeNavigationPaneCss(instance.pages[nextPage].BASE_NAME);
			}
			
	        //Remove nav-pane
	        if(nextPage == this.RACE_PAGE || nextPage == this.TUTORIAL1 || nextPage == this.TUTORIAL2
	        || nextPage == this.TUTORIAL3 || nextPage == this.TUTORIAL4){
	            Utilities.removeNavigationPane();
	        }

			// Page jQuery Animation Sliding BEGIN
			instance.currentLocation = nextPage;
	        
			currentPage.root.css({ position: 'absolute' });
			currentPage.root.transition({ x: '-984px' }, 500, function(){currentPage.detach();});

			var nextInstance = instance.pages[nextPage];

			if( !nextInstance.isInit )
			{
				nextInstance.create();
			} else {
				if( nextInstance.freshStart != null )
					nextInstance.freshStart();
			}

			nextInstance.root.addClass("page-content-wrapper");
			nextInstance.attach();

			if( !nextInstance.isInit )
				nextInstance.distributeContent(instance.jsonContent);

			if( nextInstance.activate != null )
				nextInstance.activate(instance.jsonContent);

			nextInstance.root.css({
				position:'absolute',
				x : "984px"
			});
			nextInstance.root.transition({x : '0px', y : '0px' }, 500, function(){ instance.inTransition = false; } );

			nextInstance.isInit = true;		
		}
	};

	Main.prototype.navigateBackward = function(currentPage, previousPage, args) {
		if( !this.inTransition)
		{
			this.inTransition = true;

			var instance = this;
//			console.log("navigateBackward");
			if ( previousPage == this.LANDING_PAGE )
			{
				$('#main-wrapper-content').transition({opacity:0}, 250, function(){
					$('#main-wrapper').addClass('intro');
					instance.currentLocation = previousPage;
					currentPage.detach();
					var nextInstance = instance.pages[previousPage];
					nextInstance.root.addClass("page-content-wrapper");
					nextInstance.attach();
					instance.bottomNavigation.detach();
					$('#main-wrapper-content').css({opacity:0}).transition({opacity:1},250, function() {
						if ( nextInstance.activate != null )
						{
							nextInstance.activate();
						}
					});
					instance.inTransition = false;
				});
				return;
			}

	        //console.log(previousPage);
	        //change nav-pane color
	        if(previousPage == this.OEM_BUILD_BRAKES || previousPage == this.CUSTOM_BUILD_BRAKES || previousPage == this.OFF_THE_SHELF_PAGE || previousPage == this.MODIFICATIONS_PAGE){
	            Utilities.changeNavigationPaneCss(instance.pages[previousPage].BASE_NAME);
	        }

	        //remove nav-pane
	        if(previousPage == this.BUILD_PATH_SELECTION_PAGE){
	            Utilities.removeNavigationPane();            
	        }

	        if(this.currentLocation == this.MODIFICATIONS_PAGE){
	        	this.pages[this.MODIFICATIONS_PAGE] = null;
	        	this.pages[this.MODIFICATIONS_PAGE] = new ModificationsPage(this);
	        }

			// Page jQuery Animation Sliding BEGIN
			instance.currentLocation = previousPage;

			currentPage.root.css({ position : 'absolute' })
			currentPage.root.transition({x : "984px"}, 500, function(){currentPage.detach();});

			var nextInstance = instance.pages[previousPage];
			nextInstance.root.addClass("page-content-wrapper");
			nextInstance.attach();

			if( nextInstance.activate != null )
				nextInstance.activate(instance.jsonContent);

			if( nextInstance.freshStart != null )
				nextInstance.freshStart();

			nextInstance.root.css({
				position : 'absolute',
				x : "-984px"
			});
			nextInstance.root.transition({ x : "0px" }, 500, function(){ instance.inTransition = false; } );
			// Page jQuery Animation Sliding END
		}
	};

	// these functions set the height of the footer such that it expands to fill the remaining space in the window
	function setFooterHeight() {
		var footerHeight = $(window).height() - $('footer').offset().top;
		if(footerHeight < 55){
    		$('footer').height(55);
		} else {
    		$('footer').height(footerHeight);
    	}
	};	
	window.onload = setFooterHeight; 
	window.onresize = setFooterHeight;

	window.Main = Main;

} (window));