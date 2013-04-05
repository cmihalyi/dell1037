(function (window) {

	function BuildPathPage(main) {
		this.DELL_OEM = 'dell-oem';
		this.CUSTOM_BUILT = 'custom-build';
		this.OFF_THE_SHELF = 'off-the-shelf';

		this.root = null;
		this.top = null;
		this.body = null;

		this.dellOem = null;
		this.customBuilt = null;
		this.offTheShelf = null;

		this.selectedPath = null;

		this.BASE_NAME = 'build-path-page';
		this.main = main;

		this.refundCost;

		Page.apply(this, arguments);
	};

	BuildPathPage.prototype = new Page();

	BuildPathPage.prototype.parent = Page.prototype;

	BuildPathPage.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body').addClass(this.BASE_CLASS);
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);

		this.dellOem = this.createSelectionSection(this.DELL_OEM).appendTo(this.body);
		this.customBuilt = this.createSelectionSection(this.CUSTOM_BUILT).appendTo(this.body);
		this.offTheShelf = this.createSelectionSection(this.OFF_THE_SHELF).appendTo(this.body);

		$('<div />').addClass('clearfix').appendTo(this.body);
		$("#logo img").attr({
            src : "images/WebSiteAssets/TitleSmall.png",
            alt : "Derby Dash logo",
            title : "Derby Dash logo"
        });
//        console.log($(".metaphor"));
	};

	BuildPathPage.prototype.distributeContent = function(content) {
//		console.log('in BuildPathPage.prototype.distributeContent');
		if ( this.root != null && this.top != null && this.body != null)
		{
            var instance = this;
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			// DELL OEM
			this.dellOem.find('h2').text(content.dell_oem.title);
			this.dellOem.find('.cert').text(content.dell_oem.cert);
			$('#option-section-' + this.DELL_OEM + '-content').text(content.dell_oem.description);
            this.createSelectionSectionInteractivity(content.dell_oem.description, content.dell_oem.metaphor, instance.dellOem, this.DELL_OEM);
			this.dellOem.find('button').html(content.select_button);
			$('#option-section-' + this.DELL_OEM + '-initial-cost-amount').text(this.main.CURRENCY_SYMBOL + content.dell_oem.base_cost);
			$('#option-section-' + this.DELL_OEM + '-initial-cost').text(content.cost_txt);
			
			// CUSTOM
			this.customBuilt.find('h2').text(content.custom_built.title);
			$('#option-section-' + this.CUSTOM_BUILT + '-content').text(content.custom_built.description);
            this.createSelectionSectionInteractivity(content.custom_built.description, content.custom_built.metaphor, instance.customBuilt, this.CUSTOM_BUILT);
			this.customBuilt.find('button').html(content.select_button);
			$('#option-section-' + this.CUSTOM_BUILT + '-initial-cost-amount').text(this.main.CURRENCY_SYMBOL + content.custom_built.base_cost);
			$('#option-section-' + this.CUSTOM_BUILT + '-initial-cost').text(content.cost_txt);

			// OFF THE SHELF
			this.offTheShelf.find('h2').text(content.off_the_shelf.title);
			$('#option-section-' + this.OFF_THE_SHELF + '-content').text(content.off_the_shelf.description);
            this.createSelectionSectionInteractivity(content.off_the_shelf.description, content.off_the_shelf.metaphor, instance.offTheShelf, this.OFF_THE_SHELF);
			this.offTheShelf.find('button').html(content.select_button);
			$('#option-section-' + this.OFF_THE_SHELF + '-initial-cost-amount').text(this.main.CURRENCY_SYMBOL + content.off_the_shelf.base_cost);
			$('#option-section-' + this.OFF_THE_SHELF + '-initial-cost').text(content.cost_txt);

    		$("#logo img").attr({
                src : "images/WebSiteAssets/TitleSmall.png",
                alt : "Derby Dash logo",
                title : "Derby Dash logo"
            });
		}
	};

	BuildPathPage.prototype.createSelectionSection = function(section) {
		var instance = this;
		var tempSection = $('<div />').addClass('option-section-content-body').addClass('span4').attr('id', 'option-section-' + section + '-content-body');
		
		if(section == "dell-oem"){
		  $("<span />").addClass("cert").appendTo(tempSection);
		}
		
		$('<h2 />').appendTo(tempSection);
		var OptionSectionContentBodyBottomContainer = $('<div />').addClass('option-section-content-body-bottom-container').attr('id', 'option-section-' + section + '-content-body-bottom-container').appendTo(tempSection);
		$("<span />").attr({ 'id' : section + "-metaphor", "class" : "metaphor"}).text("?").appendTo(OptionSectionContentBodyBottomContainer);
		$('<p />').attr('id', 'option-section-' + section + '-content').addClass("content").appendTo(OptionSectionContentBodyBottomContainer);
		var initialCostPTag = $('<p />').addClass("cost").appendTo(OptionSectionContentBodyBottomContainer);
		$('<span />').attr('id', 'option-section-' + section + '-initial-cost').appendTo(initialCostPTag);
		$('<span />').attr('id', 'option-section-' + section + '-initial-cost-amount').appendTo(initialCostPTag);
		var buttonDiv = $('<div />').addClass(this.BASE_NAME + '-button-container').appendTo(OptionSectionContentBodyBottomContainer);
		$('<button />').addClass("select-button").click(function(){
			
			instance.selectPath(section);
			soundManager.play('button_press');
			Utilities.setSelectedButtonClass($(this));
		}).appendTo(buttonDiv);

		return tempSection;
	};

	BuildPathPage.prototype.activate = function() {
		var instance = this;
		$('#footer-previous-button').unbind();
		$('#footer-previous-button').click(function(){
			$('#footer-go-button').unbind();
			instance.main.navigateBackward(instance, instance.main.LANDING_PAGE);
			soundManager.play('button_press');
		});
	};

	BuildPathPage.prototype.selectPath = function(path) {
		this.selectedPath = path;
		var instance = this;
		this.main.bottomNavigation.enableGoButton();

		$('#footer-go-button').unbind();
		$('#footer-go-button').click(function(){
//			console.log('BuildPathPage - ' + path );
//			console.log("THE API KEY: " + instance.main.API_KEY);
			if ( path == instance.OFF_THE_SHELF )
			{
				console.log("*************** SERVER ANALYTICS - SENDING... ***************");
            	console.log("URL: api/analytics/create/stat/");
            	console.log("Key: Total Off the Shelf Paths");
				$.ajax({
		            type: "GET",
		            url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
		 			dataType: "jsonp",
		            data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_TOTAL_OFF_THE_SHELF_PATH, value:"1", platform:$.client.os, os:$.client.browser },
		 			callback: 'jsonp',
		            success: function(data) {
		 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
		 				console.log("api/analytics/create/stat/  - SUCCESS: " + data.SUCCESS);
		 				console.log("Key: Total Off the Shelf Paths");
		 				console.log("*************** SERVER ANALYTICS - END ***************");
		            }
		        });
				instance.refundCost = (parseInt($('#option-section-' + path + '-initial-cost-amount').text().substring(1)));
				// instance.main.bottomNavigation.updateMoney(-instance.refundCost);
				// instance.main.carBuild.buildPathName is set in OffTheShelfPage (either A or B)
				instance.main.scoringSystem.addOperatingCosts(instance.refundCost);
				instance.main.navigateForward(instance, instance.main.OFF_THE_SHELF_PAGE);
			} else if ( path == instance.CUSTOM_BUILT )
			{
				console.log("*************** SERVER ANALYTICS - SENDING... ***************");
            	console.log("URL: api/analytics/create/stat/");
            	console.log("Key: Total Custom Paths");
				$.ajax({
		            type: "GET",
		            url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
		 			dataType: "jsonp",
		            data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_TOTAL_CUSTOM_PATH, value:"1", platform:$.client.os, os:$.client.browser },
		 			callback: 'jsonp',
		            success: function(data) {
		 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
		 				console.log("api/analytics/create/stat/  - SUCCESS: " + data.SUCCESS);
		 				console.log("Key: Total Custom Paths");
		 				console.log("*************** SERVER ANALYTICS - END ***************");
		            }
		        });
				// instance.refundCost = (parseInt($('#option-section-' + path + '-initial-cost-amount').text().substring(1)));
				// instance.main.bottomNavigation.updateMoney(-instance.refundCost);
				instance.main.carBuild.buildPathName = instance.main.BUILD_TYPE_CUSTOM;
				instance.main.navigateForward(instance, instance.main.CUSTOM_BUILD_CHASSIS);
			} else if ( path == instance.DELL_OEM )
			{
				console.log("*************** SERVER ANALYTICS - SENDING... ***************");
            	console.log("URL: api/analytics/create/stat/");
            	console.log("Key: Total OEM Paths");
				$.ajax({
		            type: "GET",
		            url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
		 			dataType: "jsonp",
		            data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_TOTAL_OEM_PATH, value:"1", platform:$.client.os, os:$.client.browser },
		 			callback: 'jsonp',
		            success: function(data) {
		 				console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
		 				console.log("api/analytics/create/stat/  - SUCCESS: " + data.SUCCESS);
		 				console.log("Key: Total OEM Paths");
		 				console.log("*************** SERVER ANALYTICS - END ***************");
		            }
		        });
				// instance.refundCost = (parseInt($('#option-section-' + path + '-initial-cost-amount').text().substring(1)));
				// // instance.main.bottomNavigation.updateMoney(-instance.refundCost);
				instance.main.carBuild.buildPathName = instance.main.BUILD_TYPE_OEM;
				instance.main.scoringSystem.addOperatingCosts(instance.main.buildConfigs['oem'].repair_cost);
				soundManager.play('spent', { volume : 50 });
				instance.main.navigateForward(instance, instance.main.OEM_BUILD_CHASSIS);
			}
			soundManager.play('button_press');
			// get rid of the selected class so the buttons are in correct state if the user comes back
			$('#build-path-page-content-body-body button').removeClass("selected");
		});
	};

    BuildPathPage.prototype.createSelectionSectionInteractivity = function(defaultContent, metaphorContent, section, id){
		section.find('.metaphor').toggle(
			function(){
                $(this).text("-");
                section.find('.content').text(metaphorContent).addClass("exposed");
			},
			function(){
                $(this).text("?");
                section.find(".content").text(defaultContent).removeClass("exposed");
			}
		);

        document.getElementById(id + "-metaphor").addEventListener('touchstart', function(){
            $(this).addClass("press");
        });
        
        document.getElementById(id + "-metaphor").addEventListener('touchend', function(){
            $(this).removeClass("press");
        });
    };
    
	BuildPathPage.prototype.displayHiddenContainerContent = function(section) {
//		console.log("display hidden content in container: " + section);
	};

	BuildPathPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
		
	};

	BuildPathPage.prototype.detach = function() {
		this.root.detach();
	};

	window.BuildPathPage = BuildPathPage;

} (window));