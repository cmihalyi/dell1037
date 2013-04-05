(function (window) {

	function CustomBuildChassis(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.CAR_UPPER_LEFT = '0';
		this.CAR_UPPER_RIGHT = '1';
		this.CAR_LOWER_LEFT = '2';
		this.CAR_LOWER_RIGHT = '3';
		this.CAR_STATS = 'car-stats';
		this.CAR_PREVIEW = 'car-preview';

		this.BASE_NAME = 'custom-build-chassis-page';
		this.BASE_CAR_OPTION = this.BASE_NAME + '-car-option';

		this.leftSide = null;
		this.rightSide = null;
        this.advisor = null;
        
		// four car options on left side
		this.cars = new Array();
		
		this.carStats = null;
		this.carPreview = null;

		this.refundCost;

		this.main = main;

		Page.apply(this, arguments);
	};

	CustomBuildChassis.prototype = new Page();

	CustomBuildChassis.prototype.parent = Page.prototype;

	CustomBuildChassis.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);
		this.advisor = Utilities.createOEMAdvisor().appendTo(this.root);
		
		this.cars.push(Utilities.createCarOption(this.CAR_UPPER_LEFT, this, this.main.CUSTOM_BUILD_WHEELS, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.cars.push(Utilities.createCarOption(this.CAR_UPPER_RIGHT, this, this.main.CUSTOM_BUILD_WHEELS, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.cars.push(Utilities.createCarOption(this.CAR_LOWER_LEFT, this, this.main.CUSTOM_BUILD_WHEELS, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));
		this.cars.push(Utilities.createCarOption(this.CAR_LOWER_RIGHT, this, this.main.CUSTOM_BUILD_WHEELS, null, this.main.BUILD_TYPE_CUSTOM).appendTo(this.leftSide));

		this.carStats = this.createCarStats(this.CAR_STATS).appendTo(this.rightSide);

		$('<div />').addClass('clearfix').appendTo(this.body);
	};
	
	CustomBuildChassis.prototype.createCarStats = function(stats) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_CAR_OPTION + "-" + stats).addClass('car-stats-block');
		
		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_CAR_OPTION + "-" + i, stats).appendTo(tempSelection);
		}

		return tempSelection;
	}

	CustomBuildChassis.prototype.activate = function(content) {
		// TODO - anything to do here - e.g. backward going to right place?
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			//instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			instance.main.carBuild.chassis = null;
			instance.main.navigateBackward(instance, instance.main.BUILD_PATH_SELECTION_PAGE);
			setTimeout( function(){ instance.carPreview.remove() }, 500 );
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.disableGoButton();
		
		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.custom_build_chassis.nav_pane_title);		
		}

		this.carPreview = Utilities.createSmallCarPreview(this.BASE_CAR_OPTION, this.CAR_PREVIEW, this.main.BUILD_TYPE_CUSTOM, this.main).appendTo(this.rightSide);

		var attrs = this.main.carBuild.getOverallAttrs(this.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_CAR_OPTION, this.CAR_STATS, this.carStats );
	};

	CustomBuildChassis.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.custom_build_chassis;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// Loop through the 4 car-options on the left side
			for (i = 0; i <= 3; i++) {
				/*$('#'+'car-option-'+i+"-mod1-tag").text(content.cars[i].mod1.title);
				$('#'+'car-option-'+i+"-mod1-value").text(content.cars[i].mod1.value);
				$('#'+'car-option-'+i+"-mod2-tag").text(content.cars[i].mod2.title);
				$('#'+'car-option-'+i+"-mod2-value").text(content.cars[i].mod2.value);
				$('#'+'car-option-'+i+"-cost-amount").text(this.main.CURRENCY_SYMBOL + content.cars[i].cost);*/

				switch(content.cars[i].mod1.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.cars[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.cars[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.cars[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-tag]').text(content.cars[i].mod1.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod1-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].handling);
						break;
					default:
						break;
				}
				switch(content.cars[i].mod2.title)
				{
					case "speed":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.cars[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].speed);
						break;
					case "braking":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.cars[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].braking);
						break;
					case "durability":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.cars[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].durability);
						break;
					case "handling":
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-tag]').text(content.cars[i].mod2.title);
						this.leftSide.find('span[id|=car-option-' + i + '-mod2-value]').text(this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].handling);
						break;
					default:
						break;
				}
				this.leftSide.find('span[id|=car-option-'+i+'-cost-amount]').text(this.main.CURRENCY_SYMBOL + this.main.parts.chassis[(this.main.buildConfigs["custom"].compatibleChassis[i])-1].cost);
//				console.log("car[i] = " + this.cars[i]);
				this.cars[i].find('button').html(content.select_button);
				
			}
			
			// Right side
			for ( var j = 0; j <= 3; j++ )
			{
				this.distributeStatContent(j, rootContent.car_stats[j], this.CAR_STATS);
			}
			
            Utilities.createStatPopovers(this.carStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
            Utilities.distributeOEMAdvisorContent(this.advisor, rootContent.unavailable_advisor);
		}
	};

	CustomBuildChassis.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_CAR_OPTION + "-" +option+"-option-row-title"+section).text(word);
	};
		

	CustomBuildChassis.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	CustomBuildChassis.prototype.detach = function() {
		this.root.detach();
	};

	window.CustomBuildChassis = CustomBuildChassis;

} (window));