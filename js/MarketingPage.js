(function (window) {

	function MarketingPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;
        this.footer = null;
        this.left = null;
        this.right = null;
        
		this.BASE_NAME = 'marketing-page';

		this.main = main;

        Page.apply(this, arguments);
	};

    MarketingPage.prototype = new Page();

    MarketingPage.prototype.parent = Page.prototype;

	MarketingPage.prototype.create = function() {
		var instance = this.main;
		var marketingPage = this;

		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = $("<div />").attr('id', this.BASE_NAME + '-content-body-top').appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
        this.footer = $('<div />').attr('id', this.BASE_NAME + '-content-body-footer').appendTo(this.root);
        this.left = $("<div />").addClass("span999").appendTo(this.body);
        this.right = $("<div />").addClass("span999").appendTo(this.body);

        $("<h3 />").appendTo(this.top);
        $("<p />").appendTo(this.top);
		$('<div />').addClass('clearfix').appendTo(this.body);
		$("<div />").appendTo(this.left);
		$("<h4 />").appendTo(this.left.find("div"));
		$("<p />").appendTo(this.left.find("div"));
		$("<p />").appendTo(this.left.find("div"));
		$("<button />").addClass("select-button").click(function(){
			soundManager.play('button_press');
    		instance.navigateForward(marketingPage, instance.CONCLUSION_PAGE);
		}).appendTo(this.footer);

        $("#main-wrapper").addClass("metaphor-page-main-wrapper");
	};

	MarketingPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.marketing_page;

            this.top.find("h3").text(content.page_header);
            this.top.find("p").text(content.header_text);
            
            this.left.find($("h4")).text(content.subhead);
            this.left.find($("p:nth-child(2)")).html(content.subhead_text);
            this.left.find($("p:nth-child(3)")).html(content.subhead_text2);

            this.footer.find("button").text(content.continue_button_text);
		}
	};
    
	MarketingPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	MarketingPage.prototype.detach = function() {
		this.root.detach();
	};

	window.MarketingPage = MarketingPage;

} (window));