(function (window) {

	function LandingPage(main) {
		this.root = null;
		this.footer = null;
		this.main = main;

		Page.apply(this, arguments);
	};

	LandingPage.prototype = new Page();

	LandingPage.prototype.parent = Page.prototype;
	
	LandingPage.prototype.create = function() {
		var instance = this.main;
		var landingpage = this;

		this.root = $('<div />').attr('id', 'landing-page-content-body');
		this.footer = $('<div />').attr('id', 'landing-page-content-footer');
		$('<h2 />').appendTo(this.root);
		$('<p />').appendTo(this.root);

		$('<button />').attr('id', 'footer-go-button').click(function() {
            if($("#support-detection")){
                $("#support-detection").remove();            
            }
            
			instance.navigateForward(landingpage, instance.BUILD_PATH_SELECTION_PAGE);
			soundManager.play('button_press');
		}).appendTo(this.footer);
	};

	LandingPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			this.root.find('h2').text(content.header);
			this.root.find('p').text(content.body);
			this.footer.find('button').html(content.play_button);
		}
	};

	LandingPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
		this.footer.appendTo('#main-wrapper-footer');
	};

	LandingPage.prototype.detach = function() {
		this.root.detach();
		this.footer.detach();
	};

	window.LandingPage = LandingPage;
        
} (window));