(function (window) {

	function OffTheShelfPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.CHEAP_CAR = 'cheap-car';
		this.EXPENSIVE_CAR = 'expensive-car';

		this.BASE_NAME = 'off-the-shelf-page';
		this.BASE_CAR_OPTION = this.BASE_NAME + '-car-option';

		this.cheapCar = null;
		this.expensiveCar = null;
        this.advisor = null;
        
		this.selectedCar = '';

		this.refundCost;

		this.main = main;

		Page.apply(this, arguments);
	};

	OffTheShelfPage.prototype = new Page();

	OffTheShelfPage.prototype.parts = Page.prototype;

	OffTheShelfPage.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);

		this.cheapCar = this.createPathSelection(this.CHEAP_CAR, "images/CarAssets/CarOTSAssets/OTScheap_car.png").appendTo(this.body);
		this.expensiveCar = this.createPathSelection(this.EXPENSIVE_CAR, "images/CarAssets/CarOTSAssets//OTSpricey_car.png").appendTo(this.body);

		$('<div />').addClass('clearfix').appendTo(this.body);
		this.advisor = Utilities.createOEMAdvisor().appendTo(this.root);

		var attrs;

		attrs = this.main.buildConfigs["off_the_shelf_a"].getOverallAttrs(this.main.parts,0);
		Utilities.fillAttrMeters( attrs, this.BASE_CAR_OPTION, this.CHEAP_CAR, this.cheapCar );

//		console.log(this.main.buildConfigs['off_the_shelf_b']);
		attrs = this.main.buildConfigs["off_the_shelf_b"].getOverallAttrs(this.main.parts,0);
		Utilities.fillAttrMeters( attrs, this.BASE_CAR_OPTION, this.EXPENSIVE_CAR, this.expensiveCar);
	};

	OffTheShelfPage.prototype.createPathSelection = function(section, imgSrc) {
		var instance = this;
		var tempSelection = $('<div />').addClass(this.BASE_CAR_OPTION).addClass('span6');
		var topSection = $('<div />').addClass(this.BASE_CAR_OPTION + '-top').appendTo(tempSelection);
		var divSpan2 = $('<div />').addClass('span2').appendTo(topSection);
		$('<h3 />').appendTo(divSpan2);
		var divSpan1 = $('<div />').addClass('span1').appendTo(topSection);
		$('<span />').attr('id', this.BASE_CAR_OPTION + "-" + section + '-cost-tag').appendTo(divSpan1);
		$('<span />').attr('id', this.BASE_CAR_OPTION + "-" + section + '-cost-amount').appendTo(divSpan1);
		$('<div />').addClass('clearfix').appendTo(topSection);
		var bottom = $('<div />').addClass(this.BASE_CAR_OPTION + '-bottom car-stats-block').appendTo(tempSelection);

		for ( var i = 0; i <= 3; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_CAR_OPTION + "-" + i, section).appendTo(bottom);
		}

		var display = $('<div />').addClass(this.BASE_CAR_OPTION + '-display').appendTo(tempSelection);
		$('<img />').attr("src", imgSrc).appendTo(display);
        var btn = $('<div />').addClass(this.BASE_CAR_OPTION + "-button").appendTo(tempSelection);

        $('#footer-go-button').unbind();
		$('<button />').addClass("select-button").click(function() {
//			console.log("Car Selected: " + section);
			instance.selectedCar = section;
			instance.main.bottomNavigation.enableGoButton();
			soundManager.play('button_press');
			Utilities.setSelectedButtonClass($(this));

			$('#footer-go-button').unbind();
			$('#footer-go-button').addClass("next-btn").click(function(){
				var args = new Object();
				args.carSelected = section;

				switch(section)
				{
					case 'cheap-car':
						instance.main.carBuild.setBaseCarStats(instance.main.buildConfigs.off_the_shelf_a);
						instance.main.carBuild.buildPathName = instance.main.BUILD_TYPE_OFF_THE_SHELF_A;
						break;
					case 'expensive-car':
						instance.main.carBuild.setBaseCarStats(instance.main.buildConfigs.off_the_shelf_b);
						instance.main.carBuild.buildPathName = instance.main.BUILD_TYPE_OFF_THE_SHELF_B;
						break;
					default:
						break;
				}

				instance.refundCost = (parseInt($('#'+instance.BASE_CAR_OPTION+"-"+section+"-cost-amount").text().substring(1)));
				instance.main.scoringSystem.addOperatingCosts(instance.refundCost);
				soundManager.play('spent', { volume : 50 });
//				console.log('OffTheShelfPage -- createPathSelection(): unbind go click');
				instance.main.navigateForward(instance, instance.main.MODIFICATIONS_PAGE, args);
				soundManager.play('button_press');
				// get rid of the selected class so the buttons are in correct state if the user comes back
				$('#off-the-shelf-page-content-body-body button').removeClass("selected");
			});
		}).appendTo(btn);
        
		return tempSelection;
	};

	OffTheShelfPage.prototype.activate = function(content) {
//		console.log('OffTheShelfPage -- activate()');
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
//			console.log("CLICK");
			$('#footer-go-button').unbind();
			// instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.BUILD_PATH_SELECTION_PAGE].refundCost);
			// instance.main.scoringSystem.addOperatingCosts(instance.refundCost);
			instance.main.carBuild.reset();
			instance.main.navigateBackward(instance, instance.main.BUILD_PATH_SELECTION_PAGE);
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.disableGoButton();

		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.off_the_shelf.nav_pane_title);		
		}
	};

	OffTheShelfPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.off_the_shelf;
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			this.cheapCar.find('h3').text(content.cars.cheap_car.title);
			$('#'+this.BASE_CAR_OPTION+"-"+this.CHEAP_CAR+"-cost-tag").text(content.cost_title);
			$('#'+this.BASE_CAR_OPTION+"-"+this.CHEAP_CAR+"-cost-amount").text(this.main.CURRENCY_SYMBOL + content.cars.cheap_car.cost);
			this.cheapCar.find('button').html(content.select_button);
			for ( var i = 0; i <= 3; i++ )
			{
				this.distributeStatContent(i, rootContent.car_stats[i], this.EXPENSIVE_CAR);
				this.distributeStatContent(i, rootContent.car_stats[i], this.CHEAP_CAR);
			}

			this.expensiveCar.find('h3').text(content.cars.expensive_car.title);
			$('#'+this.BASE_CAR_OPTION+"-"+this.EXPENSIVE_CAR+"-cost-tag").text(content.cost_title);
			$('#'+this.BASE_CAR_OPTION+"-"+this.EXPENSIVE_CAR+"-cost-amount").text(this.main.CURRENCY_SYMBOL + content.cars.expensive_car.cost);
			this.expensiveCar.find('button').html(content.select_button);
            
            Utilities.createStatPopovers(this.cheapCar.find(".car-option-row-help"), rootContent.car_stats_explanation);
            Utilities.createStatPopovers(this.expensiveCar.find(".car-option-row-help"), rootContent.car_stats_explanation);
            
            Utilities.distributeOEMAdvisorContent(this.advisor, rootContent.unavailable_advisor);
		}
	};

	OffTheShelfPage.prototype.distributeStatContent = function(option, word, section) {
		$('#' + this.BASE_CAR_OPTION + "-" + option+"-option-row-title"+section).text(word);
	};
		
	OffTheShelfPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	OffTheShelfPage.prototype.detach = function() {
		this.root.detach();
	};

	window.OffTheShelfPage = OffTheShelfPage;

} (window));