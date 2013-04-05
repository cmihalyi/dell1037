(function (window) {

	function ModificationsPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;
		this.leftSide = null;
		this.rightSide = null;
		this.bottom = null;

		this.leadGenElements = new Array();

		this.LEAD_GEN_TITLE = "lead-gen";

		this.BASE_NAME = "modifications-page";
		this.BASE_CLASS = "page-content-wrapper";

		this.MODS_PREVIEW = 'mods-preview';

		this.carPreview = null;
		
		this.main = main;

		Page.apply(this, arguments);
	};

	ModificationsPage.prototype = new Page();

	ModificationsPage.prototype.parent = Page.prototype;

	ModificationsPage.prototype.create = function() {
//		console.log('ModificationsPage -- create()');
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body').addClass(this.BASE_CLASS);
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
		this.leftSide = $('<div />').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').addClass('span277').appendTo(this.body);

		for ( var i = 0; i < 3; i++ )
		{
			this.leadGenElements.push(this.createLeadGenElement(i).appendTo(this.leftSide));
		}

		this.bottom = $('<div />').addClass(this.BASE_NAME + '-car-option-bottom car-stats-block').appendTo(this.rightSide);

		for ( var j = 0; j <= 3; j++ )
		{
			Utilities.createCarOptionRow(this.BASE_NAME + "-" + j).appendTo(this.bottom);
		}

		$('<div />').addClass('clearfix').appendTo(this.body);

		var instance = this;
	};

	ModificationsPage.prototype.createLeadGenElement = function(elementId) {
		var tempElement = $('<div />').addClass(this.BASE_NAME + '-' + this.LEAD_GEN_TITLE);
		var divTop = $('<div />').addClass('header').appendTo(tempElement);
		var divH3 = $('<div />').addClass('span5').appendTo(divTop);
		$('<h3 />').appendTo(divH3);

		var divSpan = $('<div />').addClass('span2').appendTo(divTop);
		$('<span />').appendTo(divSpan);
        $('<div />').addClass("clearfix").appendTo(divTop);
        
		var divBottom = $('<div />').addClass('content').appendTo(tempElement);
		$('<select />').appendTo(divBottom);
		var divInstalled = $('<div />').addClass('installed').appendTo(divBottom);
		var pInstalled = $('<p />').appendTo(divInstalled);
		$('<span />').addClass('span999').appendTo(pInstalled);
		$('<span />').addClass("span999 cancel-btn").appendTo(pInstalled);
		$('<div />').addClass('clearfix').appendTo(pInstalled);
		// divInstalled is initially hidden
		divInstalled.hide();
		return tempElement;
	};

	ModificationsPage.prototype.activate = function(content) {
		var instance = this;
		$('#footer-previous-button').unbind();
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			soundManager.play('button_press');
			//instance.main.bottomNavigation.updateMoney(instance.main.pages[instance.main.OFF_THE_SHELF_PAGE].refundCost);

			// Refund cost of last selected item depending on user Build Path
			setTimeout( function(){ instance.carPreview.remove(); }, 500 );

			instance.main.carBuild.resetMods();

			switch( instance.main.carBuild.buildPathName )
			{
				case instance.main.BUILD_TYPE_OFF_THE_SHELF_A:
					instance.main.scoringSystem.addOperatingCosts(-instance.main.buildConfigs['off_the_shelf_a'].repair_cost);
					instance.main.navigateBackward(instance, instance.main.OFF_THE_SHELF_PAGE);
					break;
				case instance.main.BUILD_TYPE_OFF_THE_SHELF_B:
					instance.main.scoringSystem.addOperatingCosts(-instance.main.buildConfigs['off_the_shelf_b'].repair_cost);
					instance.main.navigateBackward(instance, instance.main.OFF_THE_SHELF_PAGE);
					break;
				case instance.main.BUILD_TYPE_OEM:
					instance.main.scoringSystem.addOperatingCosts(-instance.main.parts.brakes[instance.main.carBuild.brakes-1].cost);
					instance.main.navigateBackward(instance, instance.main.OEM_BUILD_BRAKES);
					break;
				case instance.main.BUILD_TYPE_CUSTOM:
					instance.main.scoringSystem.addOperatingCosts(-instance.main.parts.brakes[instance.main.carBuild.brakes-1].cost);
					instance.main.navigateBackward(instance, instance.main.CUSTOM_BUILD_BRAKES);
					break;
				default:
					break;
			}

			soundManager.play('button_press');
		});
		
		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.modifications.nav_pane_title);		
		}

		var attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);

		Utilities.fillAttrMeters( attrs, this.BASE_NAME, "", this.bottom );

		instance.carPreview = Utilities.createSmallCarPreview( instance.BASE_NAME, instance.MODS_PREVIEW, instance.main.carBuild.buildPathName, instance.main).appendTo(instance.rightSide);
		
		$('#footer-go-button').unbind();
		$('#footer-go-button').addClass("next-btn").click(function(){
			instance.main.navigateForward(instance, instance.main.BUILD_CONFIRMATION_PAGE);
			soundManager.play('button_press');
			setTimeout( function(){ instance.carPreview.remove(); }, 500 );
		});
	};

	ModificationsPage.prototype.distributeContent = function(content) {
//		console.log('ModificationsPage -- distributeContent()');

		var instance = this;

		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.modifications;
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			var ele;
			for ( var i = 0; i < 3; i++ )
			{
				ele = this.leadGenElements[i];
				ele.find('h3').text(content.mods[i].title);
				ele.find('.header span').text(content.mods[i].stat.title);
				var sel = ele.find('select');
				var cancel = ele.find('.installed .cancel-btn');
				var attrs;

				switch(i)
				{
					case 0: 
						sel.change(function(){
							instance.main.carBuild.addSpoiler();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.addSmallPreviewImage(instance.carPreview, 'spoiler', '');
							Utilities.toggleLeadGenContent($(this).parent());
							soundManager.play('air_drill', {volume: 30});

							instance.main.carBuild.spoilerLeadGen = $(this).val();
						}); 
						var spoilerEle = ele;
						cancel.click(function(){
							soundManager.play('button_press');
							instance.main.carBuild.removeSpoiler();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.removeSmallPreviewImage(instance.carPreview, 'spoiler', '');
							Utilities.toggleLeadGenContent(spoilerEle.find('.content'));
						});
						break;
					case 1: 
						sel.change(function(){
							instance.main.carBuild.addShocks();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.addSmallPreviewImage(instance.carPreview, 'shocks', '' );
							Utilities.toggleLeadGenContent($(this).parent());
							soundManager.play('air_drill', {volume: 30});
							
							instance.main.carBuild.shocksLeadGen = $(this).val();
						}); 
						var shocksEle = ele;
						cancel.click(function(){
							soundManager.play('button_press');
							instance.main.carBuild.removeShocks();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.removeSmallPreviewImage(instance.carPreview, 'shocks', '');
							Utilities.toggleLeadGenContent(shocksEle.find('.content'));
						}); 
						break;
					case 2: 
						sel.change(function(){
							instance.main.carBuild.addRollBar();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.addSmallPreviewImage(instance.carPreview, 'supportBar', '');
							Utilities.toggleLeadGenContent($(this).parent());
							soundManager.play('air_drill', {volume: 30});
							
							instance.main.carBuild.roll_barLeadGen = $(this).val();
						}); 
						var supportEle = ele;
						cancel.click(function(){
							soundManager.play('button_press');
							instance.main.carBuild.removeRollBar();
							attrs = instance.main.carBuild.getOverallAttrs(instance.main.parts);
							Utilities.fillAttrMeters(attrs, instance.BASE_NAME, "", instance.bottom);
							Utilities.removeSmallPreviewImage(instance.carPreview, 'supportBar', '');
							Utilities.toggleLeadGenContent(supportEle.find('.content'));
						}); 
						break;
					default: 
						break;
				}

				for ( var j = 0; j < content.mods[i].entry_elements.length; j++ )
				{
					var textEle = content.mods[i].entry_elements[j];
					sel.append($('<option />').text(textEle).val(textEle));
				}
				ele.find('.installed span:first').text(content.purchase_confirmation);
			}

			for ( var k = 0; k <= 3; k++ )
			{
				this.distributeStatContent(k, rootContent.car_stats[k]);
			}
            Utilities.createStatPopovers(this.bottom.find(".car-option-row-help"), rootContent.car_stats_explanation);
		}
	};

	ModificationsPage.prototype.resetLeadGen = function() {
		for ( var i = 0; i < 3; i++ )
		{
			ele = this.leadGenElements[i];
			var sel = ele.find('select');

			Utilities.resetLeadGenContent($(sel).parent());
		}
	};

	ModificationsPage.prototype.distributeStatContent = function(option, word) {
		$("#" + this.BASE_NAME + "-" + option+"-option-row-title").text(word);
	};

	ModificationsPage.prototype.attach = function() {
//		console.log('ModificationsPage -- attach()');
		this.root.appendTo('#main-wrapper-content-body');
	};

	ModificationsPage.prototype.detach = function() {
//		console.log('ModificationsPage -- detach()');
		this.root.detach();
	};

	window.ModificationsPage = ModificationsPage;

} (window));