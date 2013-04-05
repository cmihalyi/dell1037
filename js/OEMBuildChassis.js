(function (window) {

	function OEMBuildChassis(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.CAR_UPPER_LEFT = '0';
		this.CAR_UPPER_RIGHT = '1';
		this.CAR_STATS = 'car-stats';
		this.CAR_PREVIEW = 'car-preview';

		this.BASE_NAME = 'oem-build-chassis-page';
		this.BASE_CAR_OPTION = this.BASE_NAME + '-car-option';

		this.leftSide = null;
		this.rightSide = null;

		// two car options on left side
		this.cars = new Array();
		this.oem_advisor = null;
		
		this.carStats = null;
		this.carPreview = null;

		this.refundCost;

		this.main = main;

		this.BUILD_TYPE = this.main.BUILD_TYPE_OEM;

		this.selectorString = null;

		Page.apply(this, arguments);
	};

	OEMBuildChassis.prototype = new Page();

	OEMBuildChassis.prototype.parent = Page.prototype;

	OEMBuildChassis.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);

		this.cars.push(Utilities.createCarOption(this.CAR_UPPER_LEFT, this, this.main.OEM_BUILD_WHEELS, null, this.main.BUILD_TYPE_OEM).appendTo(this.leftSide));
		this.cars.push(Utilities.createCarOption(this.CAR_UPPER_RIGHT, this, this.main.OEM_BUILD_WHEELS, null, this.main.BUILD_TYPE_OEM).appendTo(this.leftSide));
		$('<div />').addClass('clearfix').appendTo(this.leftSide);
		this.oem_advisor = Utilities.createOEMBuildAdvisor("images/CharacterAssets/dellAdvisor.png").appendTo(this.leftSide);
		
		this.carStats = this.createCarStats(this.CAR_STATS).appendTo(this.rightSide);
		
		$('<div />').addClass('clearfix').appendTo(this.body);
	};
	
	OEMBuildChassis.prototype.createCarStats = function(stats) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_CAR_OPTION + "-" + stats).addClass('car-stats-block');
		
		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_CAR_OPTION + "-" + i, stats).appendTo(tempSelection);
		}

		return tempSelection;
	}

	OEMBuildChassis.prototype.activate = function(content) {
		// TODO - anything to do here - e.g. backward going to right place?
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			//instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			instance.main.scoringSystem.addOperatingCosts(-instance.main.buildConfigs['oem'].repair_cost);
			instance.main.carBuild.chassis = null;
			setTimeout( function(){ instance.carPreview.remove() }, 500 );
			instance.main.navigateBackward(instance, instance.main.BUILD_PATH_SELECTION_PAGE);
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.disableGoButton();

		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.oem_build_chassis.nav_pane_title);		
		}		

		this.carPreview = Utilities.createSmallCarPreview(this.BASE_CAR_OPTION, this.CAR_PREVIEW, this.main.BUILD_TYPE_OEM, this.main).appendTo(this.rightSide);

		var attrs = this.main.carBuild.getOverallAttrs(this.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_CAR_OPTION, this.CAR_STATS, this.carStats );
	};

	OEMBuildChassis.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
            instance = this;
			var rootContent = content;
			var content = content.oem_build_chassis;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// Loop through the 2 car-options on the left side
			for (i = 0; i <= 1; i++) {
				$('#'+'car-option-'+i+"-mod1-tag").text(content.cars[i].mod1.title);
				switch(content.cars[i].mod1.title)
				{
					case "speed":
						$('#'+'car-option-'+i+"-mod1-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].speed);
						break;
					case "braking":
						$('#'+'car-option-'+i+"-mod2-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].braking);
						break;
					case "durability":
						$('#'+'car-option-'+i+"-mod1-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].durability);
						break;
					case "handling":
						$('#'+'car-option-'+i+"-mod1-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].handling);
						break;
					default:
						break;
				}
				$('#'+'car-option-'+i+"-mod2-tag").text(content.cars[i].mod2.title);
				switch(content.cars[i].mod2.title)
				{
					case "speed":
						$('#'+'car-option-'+i+"-mod2-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].speed);
						break;
					case "braking":
						$('#'+'car-option-'+i+"-mod2-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].braking);
						break;
					case "durability":
						$('#'+'car-option-'+i+"-mod2-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].durability);
						break;
					case "handling":
						$('#'+'car-option-'+i+"-mod2-value").text(this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].handling);
						break;
					default:
						break;
				}

				$('#'+'car-option-'+i+"-cost-amount").text(this.main.CURRENCY_SYMBOL + this.main.parts.chassis[(this.main.buildConfigs["oem"].compatibleChassis[i])-1].cost);
				this.cars[i].find('button').text(content.select_button);

//				console.log(this.cars[i].find('button'));
			}

			this.oem_advisor.find('h3').text(content.advisor_title);
			this.oem_advisor.find('p').text(content.advisor_text);
			Utilities.oemBuildAdvisorInteractivity(instance, content);

			// Right side
			for ( var j = 0; j <= 3; j++ )
			{
				this.distributeStatContent(j, rootContent.car_stats[j], this.CAR_STATS);
			}
            Utilities.createStatPopovers(this.carStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
		}
	};

	OEMBuildChassis.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_CAR_OPTION + "-" +option+"-option-row-title"+section).text(word);
	};
		

	OEMBuildChassis.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	OEMBuildChassis.prototype.detach = function() {
		this.root.detach();
	};

	window.OEMBuildChassis = OEMBuildChassis;

} (window));