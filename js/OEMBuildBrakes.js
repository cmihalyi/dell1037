(function (window) {

	function OEMBuildBrakes(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.BRAKE_UPPER_LEFT = '0';
		this.BRAKE_UPPER_RIGHT = '1';
		this.BRAKES_STATS = 'brakes-stats';
		this.BRAKES_PREVIEW = 'brakes-preview';

		this.BASE_NAME = 'oem-build-brakes-page';
		this.BASE_BRAKES_OPTION = this.BASE_NAME + '-brakes-option';

		this.leftSide = null;
		this.rightSide = null;

		// two car options on left side
		this.brakes = new Array();
		this.oem_advisor = null;

		this.brakeStats = null;
		this.carPreview = null;

		this.refundCost;

		this.main = main;

		this.BUILD_TYPE = this.main.BUILD_TYPE_OEM;

		Page.apply(this, arguments);
	};

	OEMBuildBrakes.prototype = new Page();

	OEMBuildBrakes.prototype.parts = Page.prototype;

	OEMBuildBrakes.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);

		// TODO - need image assets
		this.brakes.push(Utilities.createCarOption(this.BRAKE_UPPER_LEFT, this, this.main.MODIFICATIONS_PAGE, null, this.main.BUILD_TYPE_OEM).appendTo(this.leftSide));
		this.brakes.push(Utilities.createCarOption(this.BRAKE_UPPER_RIGHT, this, this.main.MODIFICATIONS_PAGE, null, this.main.BUILD_TYPE_OEM).appendTo(this.leftSide));
		$('<div />').addClass('clearfix').appendTo(this.leftSide);

		this.oem_advisor = Utilities.createOEMBuildAdvisor("images/CharacterAssets/dellAdvisor.png").appendTo(this.leftSide);
		
		this.brakeStats = this.createBrakeStats(this.BRAKES_STATS).appendTo(this.rightSide);

		$('<div />').addClass('clearfix').appendTo(this.body);
	};
	
	OEMBuildBrakes.prototype.createBrakeStats = function(stats) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_BRAKES_OPTION + "-" + stats).addClass('car-stats-block');
		
		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_BRAKES_OPTION + "-" + i, stats).appendTo(tempSelection);
		}

		return tempSelection;
	}

	OEMBuildBrakes.prototype.activate = function(content) {
		// TODO - anything to do here - e.g. backward going to right place?
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			//instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			instance.main.scoringSystem.addOperatingCosts(-instance.main.parts.wheels[instance.main.carBuild.wheels-1].cost);
			instance.main.carBuild.brakes = null;
			instance.main.navigateBackward(instance, instance.main.OEM_BUILD_WHEELS);
			setTimeout( function(){ instance.carPreview.remove() }, 500 );
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.disableGoButton();

		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.oem_build_brakes.nav_pane_title);		
		}

		this.carPreview = Utilities.createSmallCarPreview(this.BASE_BRAKES_OPTION, this.BRAKES_PREVIEW, this.main.BUILD_TYPE_OEM, this.main).appendTo(this.rightSide);

		var attrs = this.main.carBuild.getOverallAttrs(this.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_BRAKES_OPTION, this.BRAKES_STATS, this.brakeStats );
	};

	OEMBuildBrakes.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
            var instance = this;
			var rootContent = content;
			var content = content.oem_build_brakes;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// Loop through the 2 car-options on the left side
			for (i = 0; i <= 1; i++) {
				// @TODO DSK: Cleanup this page, cannot use $(#) method of find because two pages exist with these elements
				// because of the page animation slides.
				//$('#'+'car-option-'+i+"-mod1-tag").text(content.brakes[i].mod1.title);
				//$('#'+'car-option-'+i+"-mod2-tag").text(content.brakes[i].mod2.title);
				//$('#'+'car-option-'+i+"-mod1-value").text(content.brakes[i].mod1.value);
				//$('#'+'car-option-'+i+"-mod2-value").text(content.brakes[i].mod2.value);
				//$('#'+'car-option-'+i+"-cost-amount").text(this.main.CURRENCY_SYMBOL + content.brakes[i].cost);
				switch(content.brakes[i].mod1.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].handling);
						break;
					default:
						break;
				}
				switch(content.brakes[i].mod2.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].handling);
						break;
					default:
						break;
				}
				this.leftSide.find('span[id|=car-option-' + i + '-cost-amount]').text(this.main.CURRENCY_SYMBOL + this.main.parts.brakes[(this.main.buildConfigs["oem"].compatibleBrakes[i])-1].cost);
				this.brakes[i].find('button').html(content.select_button);
			}
			
			this.oem_advisor.find('h3').text(content.advisor_title);
			this.oem_advisor.find('p').text(content.advisor_text);
			Utilities.oemBuildAdvisorInteractivity(instance, content);

			// Right side
			for ( var j = 0; j <= 3; j++ )
			{
				this.distributeStatContent(j, rootContent.car_stats[j], this.BRAKES_STATS);
			}
            Utilities.createStatPopovers(this.brakeStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
		}
	};

	OEMBuildBrakes.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_BRAKES_OPTION + "-" +option+"-option-row-title"+section).text(word);
	};
		

	OEMBuildBrakes.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	OEMBuildBrakes.prototype.detach = function() {
		this.root.detach();
	};

	window.OEMBuildBrakes = OEMBuildBrakes;

} (window));