(function (window) {

	function CustomBuildWheels(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.WHEEL_UPPER_LEFT = '0';
		this.WHEEL_UPPER_RIGHT = '1';
		this.WHEEL_LOWER_LEFT = '2';
		this.WHEEL_LOWER_RIGHT = '3';
		this.WHEELS_STATS = 'wheels-stats';
		this.WHEELS_PREVIEW = 'wheels-preview';

		this.BASE_NAME = 'custom-build-wheels-page';
		this.BASE_WHEELS_OPTION = this.BASE_NAME + '-wheels-option';

		this.leftSide = null;
		this.rightSide = null;
        this.advisor = null;
        
		// four car options on left side
		this.wheels = new Array();
		
		this.wheelStats = null;
		this.carPreview = null;

		this.refundCost;

		this.main = main;

		Page.apply(this, arguments);
	};

	CustomBuildWheels.prototype = new Page();

	CustomBuildWheels.prototype.parent = Page.prototype;
	
	CustomBuildWheels.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);
		this.advisor = Utilities.createOEMAdvisor().appendTo(this.root);

		this.wheels.push(Utilities.createCarOption(this.WHEEL_UPPER_LEFT, this, this.main.CUSTOM_BUILD_BRAKES, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.wheels.push(Utilities.createCarOption(this.WHEEL_UPPER_RIGHT, this, this.main.CUSTOM_BUILD_BRAKES, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.wheels.push(Utilities.createCarOption(this.WHEEL_LOWER_LEFT, this, this.main.CUSTOM_BUILD_BRAKES, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.wheels.push(Utilities.createCarOption(this.WHEEL_LOWER_RIGHT, this, this.main.CUSTOM_BUILD_BRAKES, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));

		this.wheelStats = this.createWheelStats(this.WHEELS_STATS).appendTo(this.rightSide);
 
		$('<div />').addClass('clearfix').appendTo(this.body);
	};
	
	CustomBuildWheels.prototype.createWheelStats = function(stats) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_WHEELS_OPTION + "-" + stats).addClass('car-stats-block');
		
		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_WHEELS_OPTION + "-" + i, stats).appendTo(tempSelection);
		}
		// TODO - need to add more clearfix's?

		return tempSelection;
	}

	CustomBuildWheels.prototype.activate = function(content) {
		// TODO - anything to do here - e.g. backward going to right place?
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			// instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			instance.main.scoringSystem.addOperatingCosts(-instance.main.parts.chassis[instance.main.carBuild.chassis-1].cost);
			instance.main.carBuild.wheels = null;
			instance.main.navigateBackward(instance, instance.main.CUSTOM_BUILD_CHASSIS);
			setTimeout( function(){ instance.carPreview.remove() }, 500 );
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.disableGoButton();

		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.custom_build_wheels.nav_pane_title);		
		}

		this.carPreview = Utilities.createSmallCarPreview(this.BASE_WHEELS_OPTION, this.WHEELS_PREVIEW, this.main.BUILD_TYPE_CUSTOM, this.main).appendTo(this.rightSide);

		var attrs = this.main.carBuild.getOverallAttrs(this.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_WHEELS_OPTION, this.WHEELS_STATS, this.wheelStats );
	};

	CustomBuildWheels.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.custom_build_wheels;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// Loop through the 4 car-options on the left side
			for (i = 0; i <= 3; i++) {
				/*$('#'+'car-option-'+i+"-mod1-tag").text(content.wheels[i].mod1.title);
				$('#'+'car-option-'+i+"-mod1-value").text(content.wheels[i].mod1.value);
				$('#'+'car-option-'+i+"-mod2-tag").text(content.wheels[i].mod2.title);
				$('#'+'car-option-'+i+"-mod2-value").text(content.wheels[i].mod2.value);
				$('#'+'car-option-'+i+"-cost-amount").text(this.main.CURRENCY_SYMBOL + content.wheels[i].cost);*/

				switch(content.wheels[i].mod1.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.wheels[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.wheels[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.wheels[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.wheels[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].handling);
						break;
					default:
						break;
				}
				switch(content.wheels[i].mod2.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.wheels[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.wheels[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.wheels[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.wheels[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].handling);
						break;
					default:
						break;
				}
				this.leftSide.find('span[id|=car-option-'+i+'-cost-amount]').text(this.main.CURRENCY_SYMBOL + this.main.parts.wheels[(this.main.buildConfigs["custom"].compatibleWheels[i])-1].cost);
				this.wheels[i].find('button').html(content.select_button);
			}
			
			// Right side
			for ( var j = 0; j <= 3; j++ )
			{
				this.distributeStatContent(j, rootContent.car_stats[j], this.WHEELS_STATS);
			}
			
            Utilities.distributeOEMAdvisorContent(this.advisor, rootContent.unavailable_advisor);
            Utilities.createStatPopovers(this.wheelStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
		}
	};

	CustomBuildWheels.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_WHEELS_OPTION + "-" +option+"-option-row-title"+section).text(word);
	};
		

	CustomBuildWheels.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	CustomBuildWheels.prototype.detach = function() {
		this.root.detach();
	};

	window.CustomBuildWheels = CustomBuildWheels;

} (window));