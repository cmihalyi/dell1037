(function (window) {

	function RedirectPage(main) {
		this.root = null;
		this.footer = null;
		this.main = main;

		Page.apply(this, arguments);
	};

	RedirectPage.prototype = new Page();

	RedirectPage.prototype.parent = Page.prototype;
	
	RedirectPage.prototype.create = function() {
		console.log('RedirectPage -- create()');
		var instance = this.main;
		var RedirectPage = this;

		this.root = $('<div />').attr('id', 'redirect-page-content-body');
		this.footer = $('<div />').attr('id', 'redirect-page-content-footer');
		$('<h2 />').appendTo(this.root);
		$('<p />').appendTo(this.root);
		$('<img />').appendTo(this.root);
	};

	RedirectPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			this.root.find('h2').text(content.header);
			this.root.find('p').text(content.body);
			this.root.find('img').attr('src', content.img_src);
		}
	};

	RedirectPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
		this.footer.appendTo('#main-wrapper-footer');
	};

	RedirectPage.prototype.detach = function() {
		this.root.detach();
		this.footer.detach();
	};

	window.RedirectPage = RedirectPage;

} (window));