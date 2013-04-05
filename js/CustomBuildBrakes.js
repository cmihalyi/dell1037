(function (window) {

	function CustomBuildBrakes(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.BRAKE_UPPER_LEFT = '0';
		this.BRAKE_UPPER_RIGHT = '1';
		this.BRAKE_LOWER_LEFT = '2';
		this.BRAKE_LOWER_RIGHT = '3';
		this.BRAKES_STATS = 'brakes-stats';
		this.BRAKES_PREVIEW = 'brakes-preview';

		this.BASE_NAME = 'custom-build-brakes-page';
		this.BASE_BRAKES_OPTION = this.BASE_NAME + '-brakes-option';

		this.leftSide = null;
		this.rightSide = null;
        this.advisor = null;
        
		// four car options on left side
		this.brakes = new Array();
		
		this.brakeStats = null;
		this.brakePreview = null;

		this.refundCost;

		this.main = main;

		Page.apply(this, arguments);
	};

	CustomBuildBrakes.prototype = new Page();

	CustomBuildBrakes.prototype.parent = Page.prototype;

	CustomBuildBrakes.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);
		this.advisor = Utilities.createOEMAdvisor().appendTo(this.root);
		
//        console.log("wesondfo" + this.main.MODIFICATIONS_PAGE);
		this.brakes.push(Utilities.createCarOption(this.BRAKE_UPPER_LEFT, this, this.main.MODIFICATIONS_PAGE, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.brakes.push(Utilities.createCarOption(this.BRAKE_UPPER_RIGHT, this, this.main.MODIFICATIONS_PAGE, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.brakes.push(Utilities.createCarOption(this.BRAKE_LOWER_LEFT, this, this.main.MODIFICATIONS_PAGE, null,this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.brakes.push(Utilities.createCarOption(this.BRAKE_LOWER_RIGHT, this, this.main.MODIFICATIONS_PAGE, null,this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));

		this.brakeStats = this.createBrakeStats(this.BRAKES_STATS).appendTo(this.rightSide);

		$('<div />').addClass('clearfix').appendTo(this.body);
	};
	
	CustomBuildBrakes.prototype.createBrakeStats = function(stats) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_BRAKES_OPTION + "-" + stats).addClass('car-stats-block');
		
		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_BRAKES_OPTION + "-" + i, stats).appendTo(tempSelection);
		}

		return tempSelection;
	}

	CustomBuildBrakes.prototype.activate = function(content) {
		// TODO - anything to do here - e.g. backward going to right place?
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			// instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			instance.main.scoringSystem.addOperatingCosts(-instance.main.parts.wheels[instance.main.carBuild.wheels-1].cost);
			instance.main.carBuild.brakes = null;
			instance.main.navigateBackward(instance, instance.main.CUSTOM_BUILD_WHEELS);
			soundManager.play('button_press');
			setTimeout( function(){ instance.carPreview.remove(); }, 500 );
		});
		
		instance.main.bottomNavigation.disableGoButton();		
		
		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.custom_build_brakes.nav_pane_title);		
		}

		this.carPreview = Utilities.createSmallCarPreview(this.BASE_BRAKES_OPTION, this.BRAKES_PREVIEW, this.main.BUILD_TYPE_CUSTOM, this.main).appendTo(this.rightSide);

		var attrs = this.main.carBuild.getOverallAttrs(this.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_BRAKES_OPTION, this.BRAKES_STATS, this.brakeStats );
	};

	CustomBuildBrakes.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.custom_build_brakes;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// Loop through the 4 car-options on the left side
			for (i = 0; i <= 3; i++) {
				switch(content.brakes[i].mod1.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.brakes[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].handling);
						break;
					default:
						break;
				}
				switch(content.brakes[i].mod2.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.brakes[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].handling);
						break;
					default:
						break;
				}
				this.leftSide.find('span[id|=car-option-'+i+'-cost-amount]').text(this.main.CURRENCY_SYMBOL + this.main.parts.brakes[(this.main.buildConfigs["custom"].compatibleBrakes[i])-1].cost);

				this.brakes[i].find('button').html(content.select_button);
			}
			
			// Right side
			for ( var j = 0; j <= 3; j++ )
			{
				this.distributeStatContent(j, rootContent.car_stats[j], this.BRAKES_STATS);
			}

            Utilities.createStatPopovers(this.brakeStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
            Utilities.distributeOEMAdvisorContent(this.advisor, rootContent.unavailable_advisor);

		}
	};

	CustomBuildBrakes.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_BRAKES_OPTION + "-" +option+"-option-row-title"+section).text(word);
	};
		

	CustomBuildBrakes.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	CustomBuildBrakes.prototype.detach = function() {
		this.root.detach();
	};

	window.CustomBuildBrakes = CustomBuildBrakes;

} (window));