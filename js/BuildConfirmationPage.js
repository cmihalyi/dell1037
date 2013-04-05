(function (window) {

	function BuildConfirmationPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;

		this.rightSide = null;
		this.leftSide = null;

		this.BASE_NAME = 'build-confirmation-page';
		this.CONF_PREVIEW = 'confirmation-preview';
        
        this.carStats = null;
		this.carPreview = null;
		
		this.main = main;

		Page.apply(this, arguments);
	};

	BuildConfirmationPage.prototype = new Page();

	BuildConfirmationPage.prototype.parent = Page.prototype;

	BuildConfirmationPage.prototype.create = function() {
//		console.log('BuildConfirmationPage -- create()');
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);

		this.leftSide = $('<div />').attr('id', this.BASE_NAME + '-content-body-lower-left').addClass('span410').appendTo(this.body);
		this.rightSide = $('<div />').attr('id', this.BASE_NAME + '-content-body-lower-left').addClass('span277').appendTo(this.body);

		this.carStats = $('<div />').addClass(this.BASE_NAME + ' car-stats-block').appendTo(this.rightSide);

		for ( var i = 0; i < 4; i++ )
		{
			Utilities.createCarOptionRow(this.BASE_NAME + '-' + i).appendTo(this.carStats);
		}

		var attrs;

		attrs = this.main.carBuild.getOverallAttrs(this.main.parts);
		Utilities.fillAttrMeters( attrs, this.BASE_NAME, "", this.carStats);
		
		$('<div />').addClass('clearfix').appendTo(this.body);
	};

	BuildConfirmationPage.prototype.activate = function() {
		var instance = this;
		$('#footer-previous-button').unbind();
		$('#footer-previous-button').click(function(){
			instance.main.navigateBackward(instance, instance.main.MODIFICATIONS_PAGE);
			setTimeout( function(){ instance.carPreview.remove(); }, 500 );
			soundManager.play('button_press');
		});

		var instance = this;

		$('#footer-go-button').unbind();
		$('#footer-go-button').click(function(){
			soundManager.play('button_press');
			instance.main.carWorldProps = instance.main.carBuild.calculateWorldProps(instance.main.worldPropTable, instance.main.parts);
			if( instance.main.isTablet ){
				instance.main.navigateForward(instance, instance.main.TUTORIAL1_TABLET);
			} else {			
//				console.log('here');
				instance.main.navigateForward(instance, instance.main.TUTORIAL1);
			}
			setTimeout( function(){ instance.carPreview.remove(); }, 500 );
		});

		this.carPreview = Utilities.createLargeCarPreview( this.BASE_NAME, this.CONF_PREVIEW, instance.main.carBuild.buildPathName, instance.main).appendTo(this.leftSide);
	};

	BuildConfirmationPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.build_confirmation;
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);

			for ( var k = 0; k <= 3; k++ )
			{
				this.distributeStatContent(k, rootContent.car_stats[k]);
			}
		}
        $("#main-wrapper-navigation-pane h3").text(content.nav_pane_title);
        Utilities.createStatPopovers(this.carStats.find(".car-option-row-help"), rootContent.car_stats_explanation);
	};
	
	BuildConfirmationPage.prototype.distributeStatContent = function(option, word) {
    	$("#" + this.BASE_NAME + "-" + option+"-option-row-title").text(word);	
	};

	BuildConfirmationPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	BuildConfirmationPage.prototype.detach = function() {
		this.root.remove();
	};

	window.BuildConfirmationPage = BuildConfirmationPage;

} (window));