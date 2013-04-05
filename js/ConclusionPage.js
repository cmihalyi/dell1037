(function (window) {

	function ConclusionPage(main) {
		this.root = null;
		this.top = null;
		this.body = null;
		this.left = null;
		this.right = null;
        this.buttonFooter = null;
		
        this.footer = null;
        
		this.BASE_NAME = 'conclusion-page';

		this.main = main;

        Page.apply(this, arguments);
	};

    ConclusionPage.prototype = new Page();

    ConclusionPage.prototype.parent = Page.prototype;

	ConclusionPage.prototype.create = function() {
		this.root = $('<div />').attr('id', this.BASE_NAME + '-content-body');
		this.body = $('<div />').attr('id', this.BASE_NAME + '-content-body-body').appendTo(this.root);
        this.left = $("<div />").addClass("span453").appendTo(this.body);
        this.right = $("<div />").addClass("span390").appendTo(this.body);
        $("<div />").addClass("clearfix").appendTo(this.body);
        
        var header = $("<div />").addClass("header").appendTo(this.left);
        var results = $("<div />").addClass("results").appendTo(this.left);

        $("<div />").addClass("span999").appendTo(header);
        $("<div />").addClass("span999").appendTo(header);
        $("<div />").addClass("clearfix").appendTo(header);
        $("<h3 />").appendTo(header.find("div:nth-child(1)"));

        var bodyRight = $("<div />").addClass("banner-body").appendTo(this.right);
        this.buttonFooter = $("<div />").addClass("button-footer");
        var headerBodyRight = $("<div />").addClass("banner-header").appendTo(bodyRight);
        var bodyBodyRight = $("<div />").addClass("banner-form").appendTo(bodyRight);
        
        $("<h3 />").appendTo(headerBodyRight);
        $("<p />").appendTo(headerBodyRight);
        
        $("<form />").addClass("form-horizontal").appendTo(bodyBodyRight);
        
        for(var i=0; i<=3; i++){
            this.createFormRow(i).appendTo(bodyBodyRight.find("form"));
        }
        
        var formControls = this.right.find(".controls input");
        $(formControls[0]).attr({id: "initials", maxlength: "3"});
        $(formControls[1]).attr("id", "fullName");
        $(formControls[2]).attr("id", "email");
        $(formControls[3]).attr("id", "optOut");
        
        $("<div />").appendTo(bodyBodyRight.find("form"));
        $("<button />").addClass("select-button").appendTo(bodyBodyRight.find("form > div:nth-child(5)"));

        for(var i=0; i<=2; i++){
            $("<div />").addClass("span999").wrapInner($("<button />").addClass("select-button")).appendTo(this.buttonFooter);
        }
        
        $("<div />").addClass("clearfix").appendTo(this.buttonFooter);
        
		$("#logo img").attr({
            src : "images/WebSiteAssets/TitleSmall.png",
            alt : "Derby Dash logo",
            title : "Derby Dash logo"
        });
	};

	ConclusionPage.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
            var instance = this;
            var rootContent = content;
            var content = rootContent.conclusion_page;
            
            this.left.find($(".header h3")).text(content.leaderboard_header);            
            this.right.find("h3").text(content.form_header);
            this.right.find("p").text(content.form_body);

            this.right.find('.control-group:nth-child(1) label').text(content.initials_label);
            this.right.find('.control-group:nth-child(2) label').text(content.name_label);
            this.right.find('.control-group:nth-child(3) label').text(content.email_label);
            this.right.find('.checkbox').html("<input id='optIn' type='checkbox' name='optIn'/>" + content.opt_in_text);
            this.right.find('form div:last-child button').text(content.continue_button_text).click(function(e){
                e.preventDefault();
                soundManager.play('button_press');
                console.log("*************** SERVER ANALYTICS - SENDING... ***************");
                console.log("URL: api/analytics/create/stat/");
                console.log("Key: Continue Button Clicked");
                $.ajax({
                    type: "GET",
                    url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
                    dataType: "jsonp",
                    data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_CONTINUE_CLICKED, value:"1", platform:$.client.os, os:$.client.browser },
                    callback: 'jsonp',
                    success: function(data) {
                        console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                        console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
                        console.log("Key: Continue Button Clicked");
                        console.log("*************** SERVER ANALYTICS - END ***************");
                    }
                });
                // console.log(instance.right.find("#initials").val());
                // console.log("uuid: " + instance.main.UNIQUE_RANK_ID + ", initials: " + instance.right.find("#initials").val());
                console.log("*************** SERVER ANALYTICS - SENDING... ***************");
                console.log("URL: api/dell1037leaderboard/update/score/");
                console.log("UUID: " + instance.main.UNIQUE_RANK_ID);
                console.log("Initials: " + instance.right.find("#initials").val());
                $.ajax({
                    type: "GET",
                    url: instance.main.SERVER_URL + "api/dell1037leaderboard/update/score/", 
                    dataType: "jsonp",
                    data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, uuid:instance.main.UNIQUE_RANK_ID, initials:instance.right.find("#initials").val() },
                    callback: 'jsonp',
                    success: function(data) {
                        console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                        console.log("api/dell1037leaderboard/update/score/ - SUCCESS: " + data.SUCCESS);
                        console.log("*************** SERVER ANALYTICS - END ***************");
                    }
                });

                console.log("*************** SERVER ANALYTICS - SENDING... ***************");
                console.log("URL: api/leadgen/submit/");
                console.log("Name: " + instance.right.find('#fullName').val());
                console.log("Email: " + instance.right.find('#email').val());
                console.log("Opt-In: " + instance.right.find('#optIn').prop("checked"));
                console.log("Industry: " + instance.main.carBuild.spoilerLeadGen);
                console.log("Job Title: " + instance.main.carBuild.shocksLeadGen);
                console.log("Region: " + instance.main.carBuild.roll_barLeadGen);
                $.ajax({
                    type: "GET",
                    url: instance.main.SERVER_URL + "api/leadgen/submit/", 
                    dataType: "jsonp",
                    data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, industry:instance.main.carBuild.spoilerLeadGen, job_title:instance.main.carBuild.shocksLeadGen, region:instance.main.carBuild.roll_barLeadGen, name:instance.right.find('#fullName').val(), email:instance.right.find('#email').val(), opt_in:instance.right.find('#optIn').prop("checked") },
                    callback: 'jsonp',
                    success: function(data) {
                        console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                        console.log("api/leadgen/submit/ - SUCCESS: " + data.SUCCESS);
                        console.log("Name, email, opt-in");
                        console.log("Industry, job title, region");
                        console.log("*************** SERVER ANALYTICS - END ***************");
                    }
                });
                
                instance.left.find(".current-rank td:nth-child(2)").text(instance.right.find("#initials").val());
                // stuff the initials back into the array
                if ( instance.main.LEADERBOARD_SCORES === null ||typeof instance.main.LEADERBOARD_SCORES === "undefined"){
                	// skip the update
                } else {
					for(var i = 0; i < instance.main.LEADERBOARD_SCORES.length; i++){
						console.log('rank=' + instance.main.LEADERBOARD_SCORES[i].rank);
						if(instance.main.LEADERBOARD_SCORES[i].rank == instance.main.USERS_RANK)
						{
							console.log('got a match');
							instance.main.LEADERBOARD_SCORES[i].initials = instance.right.find("#initials").val();
							console.log(instance.main.LEADERBOARD_SCORES);
							break;
						}
					}
					for(var j = 0; j < instance.main.LEADERBOARD_SCORES.length; j++){
						console.log("initials=" + instance.main.LEADERBOARD_SCORES[j].initials);
					}
				}
                // form has been submitted, clear the fields and hide it
                instance.right.find("#initials").val("");
                instance.right.find('#fullName').val("");
                instance.right.find('#email').val("");
                instance.right.find('#optIn').attr("checked", false);
        		instance.right.find(".banner-form").hide();
                // set the text elements to the continue variety
                instance.right.find("h3").text(content.continue_header);
                instance.right.find("p").html(content.continue_body);
                instance.buttonFooter.appendTo(instance.right);

            });
            
            this.buttonFooter.find(".span999:nth-child(1) button").text(content.try_again_button_text).click( function() {
                soundManager.play('button_press');
//            	console.log('tryagain');
                instance.main.bottomNavigation.attach();
                instance.main.scoringSystem.resetToCached();
				instance.main.navigateBackward(instance, instance.main.RACE_PAGE);            
            });
            this.buttonFooter.find(".span999:nth-child(2) button").text(content.new_car_button_text).click( function() {
                soundManager.play('button_press');
//            	console.log('newCar');
            	instance.main.carBuild.reset();
                $("#main-wrapper").removeClass("metaphor-page-main-wrapper");
                instance.main.bottomNavigation.attach();
                instance.main.bottomNavigation.showGoButton();
                instance.main.bottomNavigation.showPreviousButton();
                instance.main.bottomNavigation.disableGoButton();
                instance.main.scoringSystem.reset();
                $('#bottom-navigation-footer').removeClass('race-page');
                window.main.pages[window.main.MODIFICATIONS_PAGE].resetLeadGen();
				instance.main.navigateBackward(instance, instance.main.BUILD_PATH_SELECTION_PAGE);            
            });
            this.buttonFooter.find(".span999:nth-child(3) button").text(content.oem_blog_button_text).click( function() {
                soundManager.play('button_press');
            	console.log("*************** SERVER ANALYTICS - SENDING... ***************");
                console.log("URL: api/analytics/create/stat/");
                console.log("Key: Total OEM Blog Link Clicks");
                $.ajax({
                    type: "GET",
                    url: instance.main.SERVER_URL + "api/analytics/create/stat/", 
                    dataType: "jsonp",
                    data: { api_key: instance.main.API_KEY, project_key: instance.main.PROJECT_KEY, user: instance.main.USER_KEY, key: instance.main.KEY_TOTAL_OEM_BLOG_LINK_CLICKS, value:"1", platform:$.client.os, os:$.client.browser },
                    callback: 'jsonp',
                    success: function(data) {
                        console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                        console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
                        console.log("Key: Total OEM Blog Link Clicks");
                        console.log("*************** SERVER ANALYTICS - END ***************");
                    }
                });
            	window.open( content.oem_blog_url);
            });
		}
	};

    ConclusionPage.prototype.createLeaderboardRow = function(rank, userRank, userInitials, userPath, userScore, classTag){
        var row = $("<tr />").attr("id", "rank-" + userRank).addClass(classTag);
        $("<td />").text(userRank).appendTo(row);
        $("<td />").text(userInitials).appendTo(row);
        $("<td />").text(userPath).appendTo(row);
        $("<td />").text(userScore).appendTo(row);
        
        if(userRank == rank){
            row.addClass("current-rank");
            row.find('td:nth-child(2)').text("___");
        }
        return row;
    }
    
    ConclusionPage.prototype.createFormRow = function(index){
        var row = $("<div />").addClass("control-group");
        
        if(index < 3){
            $("<label />").attr({
                'class' : "control-label",
            }).appendTo(row);
            
            $("<div />").addClass("controls").appendTo(row);
            
            $("<input />").attr({
                'class' : "",
                type : "text",
                id : "",
                placeholder: ""
            }).appendTo(row.find(".controls"));
        }else{
            $("<div />").addClass("controls").appendTo(row);
            $("<label />").addClass("checkbox").appendTo(row.find(".controls"));
            $("<input />").attr({
                'class' : "",
                type : "checkbox",
                id : "",
                placeholder: ""
            }).appendTo(row.find(".checkbox"));            
        }
        return row;
    }
    
    ConclusionPage.prototype.activate = function(content) {
    	console.log('in activate()');
        var instance = this;
        var rootContent = content;
        var content = rootContent.conclusion_page;
        
        var header = instance.left.find('.header');
        var results = instance.left.find('.results');
        if(instance.main.LEADERBOARD_SCORES === null || typeof instance.main.LEADERBOARD_SCORES === 'undefined') {
        	// create the no server thingie
        	$('<p />').text(content.leaderboard_offline_text).appendTo(results);
        } else {
        	header.find('.btn-group').remove();
        	results.find('table').remove();
			$("<div />").attr({"class" : "btn-group", "data-toggle" : "buttons-radio"}).appendTo(header.find("div:nth-child(2)"));
			$("<button />").addClass("btn").appendTo(header.find(".btn-group"));
			$("<button />").addClass("btn").appendTo(header.find(".btn-group"));
			
			$("<table />").appendTo(results);
			$("<thead />").appendTo(results.find("table"));
			$("<tr />").appendTo(results.find("thead"));
			$("<th />").appendTo(results.find("thead tr"));
			$("<th />").appendTo(results.find("thead tr"));
			$("<th />").appendTo(results.find("thead tr"));
			$("<th />").appendTo(results.find("thead tr"));
			$("<tbody />").appendTo(results.find("table"));
			
        	this.left.find($(".results th:nth-child(1)")).text(content.rank_header);
			this.left.find($(".results th:nth-child(2)")).text(content.initials_header);
			this.left.find($(".results th:nth-child(3)")).text(content.build_type_header);
			this.left.find($(".results th:nth-child(4)")).text(content.score_header);

			// Create the Your Scores tbody
			for(var i=0; i<instance.main.LEADERBOARD_SCORES.length; i++){
//				console.log(instance.main.LEADERBOARD_SCORES[i]);
				instance.createLeaderboardRow(instance.main.USERS_RANK, instance.main.LEADERBOARD_SCORES[i].rank, instance.main.LEADERBOARD_SCORES[i].initials, instance.main.LEADERBOARD_SCORES[i].path, instance.main.LEADERBOARD_SCORES[i].score, 'your-score').appendTo(results.find("tbody"));
			} 
			for(var i=0; i<instance.main.LEADERBOARD_TOP_TEN.length; i++){
				console.log(instance.main.LEADERBOARD_TOP_TEN[i]);
				instance.createLeaderboardRow(instance.main.USERS_RANK, instance.main.LEADERBOARD_TOP_TEN[i].rank, instance.main.LEADERBOARD_TOP_TEN[i].initials, instance.main.LEADERBOARD_TOP_TEN[i].path, instance.main.LEADERBOARD_TOP_TEN[i].score, 'top-ten').appendTo(results.find("tbody"));
			}                   
			if(instance.main.USERS_RANK > 10){
				header.find(".btn:nth-child(1)").addClass("active");
				this.left.find('.your-score').addClass('shown');
			}else{
				header.find(".btn:nth-child(2)").addClass("active");
				this.left.find('.top-ten').addClass('shown');
			}
	
			this.left.find($(".header .btn:nth-child(1)")).unbind('click');
			this.left.find($(".header .btn:nth-child(1)")).html(content.leaderboard_button1_text).click(function(){
                soundManager.play('button_press');
				console.log('in your score click');
				if( !$(this).hasClass('active')){
					console.log('found active');
					instance.left.find('tbody tr.top-ten').removeClass('shown');
					instance.left.find('tbody tr.your-score').addClass('shown');
				}
			});
			this.left.find($(".header .btn:nth-child(2)")).unbind('click');
			this.left.find($(".header .btn:nth-child(2)")).html(content.leaderboard_button2_text).click(function(){
                soundManager.play('button_press');
				console.log('in top-ten click');
				if( !$(this).hasClass('active')){
					console.log('found active');
					instance.left.find('tbody tr.your-score').removeClass('shown');
					instance.left.find('tbody tr.top-ten').addClass('shown');
				}
			});
		}
		
        instance.right.find("h3").text(content.form_header);
        instance.right.find("p").text(content.form_body);
        instance.right.find(".banner-form").show();
        instance.buttonFooter.detach();                       
    };
    
	ConclusionPage.prototype.attach = function() {
        console.log("*************** SERVER ANALYTICS - SENDING... ***************");
        console.log("URL: api/analytics/create/stat/");
        console.log("Key: Conclusion Page");
        $.ajax({
            type: "GET",
            url: this.main.SERVER_URL + "api/analytics/create/stat/", 
            dataType: "jsonp",
            data: { api_key: this.main.API_KEY, project_key: this.main.PROJECT_KEY, user: this.main.USER_KEY, key: this.main.KEY_CONCLUSION_PAGE, value:"1", platform:$.client.os, os:$.client.browser },
            callback: 'jsonp',
            success: function(data) {
                console.log("*************** SERVER ANALYTICS - SUCCESS ***************");
                console.log("api/analytics/create/stat/ - SUCCESS: " + data.SUCCESS);
                console.log("Key: Conclusion Page");
                console.log("*************** SERVER ANALYTICS - END ***************");
            }
        });
		this.root.appendTo('#main-wrapper-content-body');
	};

	ConclusionPage.prototype.detach = function() {
        // $(".span390 > div:nth-child(2) .span999:nth-child(1) button").unbind();
        // $(".span390 > div:nth-child(2) .span999:nth-child(2) button").unbind();
        // $(".span390 > div:nth-child(2) .span999:nth-child(3) button").unbind();
		this.root.detach();
	};

	window.ConclusionPage = ConclusionPage;

} (window));