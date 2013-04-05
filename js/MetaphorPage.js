(function (window) {

	function MetaphorPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;
        this.footer = null;
        
		this.BASE_NAME = 'metaphor-page';

		this.main = main;

        Page.apply(this, arguments);
	};

    MetaphorPage.prototype = new Page();

    MetaphorPage.prototype.parent = Page.prototype;

	MetaphorPage.prototype.create = function() {
		var instance = this.main;
		var metaphorpage = this;

		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.top = $("<div />").attr('id', this.BASE_NAME + '-content-body-top').appendTo(this.root);
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
        this.footer = $('<div />').attr('id', this.BASE_NAME + '-content-body-footer').appendTo(this.root);
        var right = $("<div />").appendTo(this.top);

        $("<h3 />").appendTo(right);
        $("<p />").appendTo(right);
        
        var left = $("<div />").addClass("span999").appendTo(this.body);
        
        //rows for sections
        for(i = 0; i <= 3; i ++){
            this.createSection().appendTo(left);
        }
        
        right = $("<div />").addClass("span999").appendTo(this.body);
        
        //row for section values
        for(i = 0; i <=3; i++){
            $("<div />").wrapInner($("<span />")).appendTo(right);
        }
        
		$('<div />').addClass('clearfix').appendTo(this.body);
		
		$("<button />").addClass("select-button").click(function(){
            soundManager.play('button_press');
    		instance.navigateForward(metaphorpage, instance.MARKETING_PAGE);
		}).appendTo(this.footer);

		$("#logo img").attr({
            src : "images/WebSiteAssets/TitleSmall.png",
            alt : "Derby Dash logo",
            title : "Derby Dash logo"
        });
	};

	MetaphorPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			var rootContent = content;
			var content = content.metaphor_page;
            
            this.top.find("img").attr({
                src : "images/ConclusionAssets/ConclusionDellLogo_Small.png",
                alt : "Dell logo",
                title : "Dell logo"
            });
            this.top.find("h3").text(content.page_header);
            this.top.find("p").text(content.header_text);
            
            this.body.find(".span999:nth-child(1) > div:nth-child(1) h4").text(content.investment_header);
            this.body.find(".span999:nth-child(1) > div:nth-child(1) p").text(content.investment_text);
            this.body.find(".span999:nth-child(1) > div:nth-child(2) h4").text(content.profits_header);
            this.body.find(".span999:nth-child(1) > div:nth-child(2) p").text(content.profits_text);
            this.body.find(".span999:nth-child(1) > div:nth-child(3) h4").text(content.costs_header);
            this.body.find(".span999:nth-child(1) > div:nth-child(3) p").text(content.costs_text);
            this.body.find(".span999:nth-child(1) > div:nth-child(4) h4").text(content.revenue_header);
            this.body.find(".span999:nth-child(1) > div:nth-child(4) p").text(content.revenue_text);
            
            this.body.find(".span999:nth-child(2) > div:nth-child(1) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getScore() );
            this.body.find(".span999:nth-child(2) > div:nth-child(2) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getProfits() );
            this.body.find(".span999:nth-child(2) > div:nth-child(3) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getOperatingCosts() );
            this.body.find(".span999:nth-child(2) > div:nth-child(4) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getRevenue() );

            this.footer.find("button").text(content.continue_button_text);
		}
	};

    MetaphorPage.prototype.activate = function(){
        this.main.bottomNavigation.detach();
        $("#main-wrapper").addClass("metaphor-page-main-wrapper");

        this.body.find(".span999:nth-child(2) > div:nth-child(1) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getScore() );
        this.body.find(".span999:nth-child(2) > div:nth-child(2) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getProfits() );
        this.body.find(".span999:nth-child(2) > div:nth-child(3) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getOperatingCosts() );
        this.body.find(".span999:nth-child(2) > div:nth-child(4) span").text(this.main.CURRENCY_SYMBOL + this.main.scoringSystem.getRevenue() );
    };

    MetaphorPage.prototype.createSection = function(){
        var sectionBlock = $("<div />");
        $("<h4 />").appendTo(sectionBlock);
        $("<p />").appendTo(sectionBlock);
        
        return sectionBlock;
    }
    
	MetaphorPage.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-body');
	};

	MetaphorPage.prototype.detach = function() {
		this.root.detach();
	};

	window.MetaphorPage = MetaphorPage;

} (window));