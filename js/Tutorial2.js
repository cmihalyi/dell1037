(function (window) {

	function Tutorial2(main) {
//		console.log('constructing Tutorial2');
		this.root = null;
		this.top = null;
		this.body = null;

		this.BASE_NAME = 'tutorial2-page';

		this.bottom = null;

		this.main = main;

		Page.apply(this, arguments);
	};

	Tutorial2.prototype = new Page();

	Tutorial2.prototype.parent = Page.prototype;

	Tutorial2.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = Utilities.createFemaleAdvisorTop(this.BASE_NAME).appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);

		this.bottom = $('<div />').addClass(this.BASE_NAME + '-content-bottom center').appendTo(this.body);
		var contentContainer = $('<div />').addClass(this.BASE_NAME + '-content-container').appendTo(this.bottom);
		$('<div />').addClass(this.BASE_NAME + '-content-image').appendTo(contentContainer);
		var skipDiv = $('<div />').addClass(this.BASE_NAME + '-content-skip').appendTo(contentContainer);
		var pTag = $('<p />').appendTo(skipDiv);
		$('<span />').addClass(this.BASE_NAME + '-content-skip-text').appendTo(pTag);
		
		$('<div />').addClass('clearfix').appendTo(this.body);

		var instance = this;
	};
	
	Tutorial2.prototype.activate = function(content) {
		$('#footer-previous-button').unbind();
		var instance = this;
		$('#footer-previous-button').addClass("prev-btn").click(function(){
			$('#footer-go-button').unbind();
			if( instance.main.isTablet ){
				instance.main.navigateBackward(instance, instance.main.TUTORIAL1_TABLET);
			} else {
				instance.main.navigateBackward(instance, instance.main.TUTORIAL1);
			}
			soundManager.play('button_press');
		});
		
		instance.main.bottomNavigation.enableGoButton();
		
		if(content != null){
            $("#main-wrapper-navigation-pane h3").text(content.tutorial2.nav_pane_title);		
		}

		$('#footer-go-button').unbind();
		$('#footer-go-button').click(function(){
			soundManager.play('button_press');
			instance.main.bottomNavigation.disableGoButton();
			instance.main.navigateForward(instance, instance.main.RACE_PAGE);
			$('#footer-go-button').unbind();
		});
	};

	Tutorial2.prototype.distributeContent = function(content) {
		var instance = this;
		
		if ( this.root != null )
		{
			var instance = this;
			
			var rootContent = content;
			var content = content.tutorial2;
			
			// Top
			this.top.find('h3').text(content.coordinator_name);
			this.top.find('p').text(content.coordinator_text);
			
			// Content
			// TODO: need to get the special char Fu wants 0x9b
			var right_caret = String.fromCharCode( 155);
			var skipTutorial = this.bottom.find('.' + this.BASE_NAME + '-content-skip-text');
			skipTutorial.text(content.skip_text + ' >');
			
			skipTutorial.click( function() {
				instance.main.bottomNavigation.disableGoButton();
				instance.main.navigateForward(instance, instance.main.RACE_PAGE);
				$('#footer-go-button').unbind();
			});
		}
	};

	Tutorial2.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	Tutorial2.prototype.detach = function() {
		this.root.detach();
	};

	window.Tutorial2 = Tutorial2;

} (window));