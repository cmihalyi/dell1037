(function (window) {

	function Utilities() {};

	Utilities.createCarOptionRow = function(option, section) {
	   if ( section == null )
	   {   
	       section = '';
	   }
		var row = $('<div />').addClass('car-option-row').attr('id', 'car-option-' + option + section);
		var optionHelp = $('<div />').addClass('span1 car-option-row-help').appendTo(row);
		$('<span />').text("?").appendTo(optionHelp);
		var rowTitle = $('<div />').addClass('span1 car-option-row-title').appendTo(row);
		$('<span />').attr('id', option + "-option-row-title"+section).appendTo(rowTitle);
		var rowRating = $('<div />').addClass('span1 car-option-row-rating').appendTo(row);
		$('<div />').attr('id', option + "-option-row-rating-section"+section).appendTo(rowRating);
		$('<div />').addClass('clearfix').appendTo(row);
				
		return row;
	};

	Utilities.createLargeCarOptionRow = function(option, section) {
		var row = $('<div />').addClass('large-car-option-row').attr('id', 'section-' + section + '-large-car-option-' + option);
		$('<span />').addClass('large-car-option-row-title').attr('id', "section-" + section + "-large-car-" + option + "-option-row-title").appendTo(row);
		$('<div />').addClass('large-car-option-row-rating').attr('id', "section-" + section + "-large-car-" + option + "-option-row-rating-section").appendTo(row);
		return row;
	};
	
	Utilities.createStatPopovers = function(domObj, popContent){
        for(var x=0; x<domObj.length; x++){
            $span = $(domObj[x]).find('span');
            $span.attr({
                "data-animation" : false,
                "data-content" : popContent[x],
                "data-placement" : "top",
                "data-trigger" : "manual",
                "data-delay" : 250
            }).popover();

            $span.click(
                function(e){
                    e.stopPropagation();
                    $('.car-option-row-help span').popover('hide');                    
                    $(this).popover('show');
                }
            );
        }

        $('html').click(function(){
            $('.car-option-row-help span').popover('hide');
        });

	};

	Utilities.createFemaleAdvisorTop = function(location) {
		var top = $('<div />').attr('id', location + '-content-body-top');
        var block = $('<div />').addClass('female-advisor-block').appendTo(top);
        var col1 = $('<div />').addClass('span999').appendTo(block);
        var col2 = $('<div />').addClass('span999').appendTo(block);
        $('<div />').addClass('clearfix').appendTo(block);
        
		$('<img />').attr({
		  src : "images/CharacterAssets/DDraceCoordinatorThumb.png",
		  alt : "Female Advisor",
		  title : "Female Advisor"
		}).appendTo(col1);
		
		$('<h3 />').appendTo(col2);
		$('<p />').appendTo(col2);
		return top;
	};
    
    Utilities.createOEMAdvisor = function(){
        var block = $("<div />").addClass("oem-unavailable-advisor-block");
        var imgBlock = $("<div />").addClass("advisor-img").appendTo(block);
        var contentBlock = $("<div />").addClass("advisor-content").appendTo(block);
        $("<img />").appendTo(imgBlock);

        $("<div />").addClass("span999").wrapInner($("<span />").text("?")).appendTo(contentBlock);
        $("<div />").addClass("span999").wrapInner($("<p />").text("OEM Advisor Not Available")).appendTo(contentBlock);        
        $("<div />").addClass("clearfix").appendTo(contentBlock);

        return block;
    };

    Utilities.distributeOEMAdvisorContent = function(advisorObj, content){
        advisorObj.find('img').attr({
            src : content.img_src,
            title : content.img_title,
            alt : content.img_alt
        });

        advisorObj.find('p').text(content.title);
        advisorObj.find('span').attr({
            "data-animation" : false,
            "data-content" : content.popover_content,
            "data-placement" : "left",
            "data-trigger" : "manual",
            "data-delay" : 250
        }).popover();
        
        advisorObj.find('span').click(function(e){
            e.stopPropagation();
            $(this).popover('show');
        });

        $('html').click(function(){
            advisorObj.find('span').popover('hide');
        });

    };
    
	Utilities.createOEMBuildAdvisor = function(imgSrc) {
		var tempSelection = $('<div />').addClass('oem-available-advisor-block');
		var divDisplay = $('<div />').addClass('oem-adv-display span999').appendTo(tempSelection);
		var divContent = $('<div />').addClass('oem-adv-content span999').appendTo(tempSelection);
		var divHdr  = $('<div />').addClass('oem-adv-header').appendTo(divContent);

		$('<img />').attr({src : imgSrc, width : "118px"}).appendTo(divDisplay);
        $("<div />").addClass("span999").wrapInner($("<h3 />")).appendTo(divHdr);        
        $("<div />").addClass("span999").wrapInner($("<span />").text("?").addClass("metaphor")).appendTo(divHdr);        
        $("<div />").addClass("clearfix").appendTo(divHdr);
        $("<p />").appendTo(divContent);
        $("<div />").addClass("clearfix").appendTo(tempSelection);
        
        return tempSelection;
	};

    Utilities.oemBuildAdvisorInteractivity = function(instance, content){
        instance.oem_advisor.find('.metaphor').toggle(
            function(){
                instance.oem_advisor.find('p').addClass("expose");
                instance.oem_advisor.find('p').text(content.advisor_info);
            },
            function(){
                instance.oem_advisor.find('p').removeClass("expose");
                instance.oem_advisor.find('p').text(content.advisor_text);
            }
        );
    }
    
    Utilities.createCarOption = function(section, instance, forwardLocation, refundCost, buildType) {
		var tempSelection = $('<div />').addClass('car-option span999');
		var display = $('<div />').addClass('car-option-display').appendTo(tempSelection);
		var topSection = $('<div />').addClass('car-option-top').appendTo(display);
		var divCarAttributes = $('<div />').addClass('span999').appendTo(topSection);
		var divCost = $("<div />").addClass("span999").appendTo(topSection);		
		var divCarAttributesLeftTop = $("<div />").appendTo(divCarAttributes);
		var divCarAttributesLeftBottom = $("<div />").appendTo(divCarAttributes);
		
		$('<span />').attr('id', 'car-option-' + section + '-mod1-tag').appendTo(divCarAttributesLeftTop);
		$('<span />').attr('id', 'car-option-' + section + '-mod1-value').appendTo(divCarAttributesLeftTop);
		$('<span />').attr('id', 'car-option-' + section + '-mod2-tag').appendTo(divCarAttributesLeftBottom);
		$('<span />').attr('id', 'car-option-' + section + '-mod2-value').appendTo(divCarAttributesLeftBottom);
		$('<span />').attr('id', 'car-option-' + section + '-cost-amount').appendTo(divCost);
		
		$("<div />").addClass("clearfix").appendTo(topSection);
		
		
        var btn = $('<div />').addClass('car-option-button').appendTo(display);
//		console.log("forward location: " + forwardLocation);
        
        var owner = this;

		$('<button />').addClass("select-button").click(function() {
//			console.log("Car Selected: " + section);
			instance.selectedCar = section;
			instance.main.bottomNavigation.showGoButton();
			soundManager.play('button_press');
			Utilities.setSelectedButtonClass($(this));

			var attrs;
			var selectorString;

			var carPreview = null;

			if( instance.BASE_NAME.search('chassis') != -1 )
			{
				instance.main.carBuild.setChassis(instance.main.buildConfigs[buildType].compatibleChassis[section]);
				owner.fillAttrMeters(instance.main.carBuild.getOverallAttrs(instance.main.parts), instance.BASE_CAR_OPTION, instance.CAR_STATS, instance.carStats);
				instance.refundCost = instance.main.parts.chassis[instance.main.buildConfigs[buildType].compatibleChassis[section]-1].cost;

				Utilities.addSmallPreviewImage(instance.carPreview, 'chassis', instance.main.buildConfigs[buildType].compatibleChassis[section]);

				carPreview = instance.carPreview;
			}
			else if( instance.BASE_NAME.search('wheels') != -1 )
			{
				instance.main.carBuild.setWheels(instance.main.buildConfigs[buildType].compatibleWheels[section]);
				owner.fillAttrMeters(instance.main.carBuild.getOverallAttrs(instance.main.parts), instance.BASE_WHEELS_OPTION, instance.WHEELS_STATS, instance.wheelStats);
				instance.refundCost = instance.main.parts.wheels[instance.main.buildConfigs[buildType].compatibleWheels[section]-1].cost;

				Utilities.addSmallPreviewImage(instance.carPreview, 'wheels', instance.main.buildConfigs[buildType].compatibleWheels[section]);

				carPreview = instance.carPreview;
			}
			else if( instance.BASE_NAME.search('brakes') != -1 )
			{
				instance.main.carBuild.setBrakes(instance.main.buildConfigs[buildType].compatibleBrakes[section]);
				owner.fillAttrMeters(instance.main.carBuild.getOverallAttrs(instance.main.parts), instance.BASE_BRAKES_OPTION, instance.BRAKES_STATS, instance.brakeStats);
				instance.refundCost = instance.main.parts.brakes[instance.main.buildConfigs[buildType].compatibleBrakes[section]-1].cost;

				Utilities.addSmallPreviewImage(instance.carPreview, 'brakes', instance.main.buildConfigs[buildType].compatibleBrakes[section]);

				carPreview = instance.carPreview;
			}

			$('#footer-go-button').unbind();
			$('#footer-go-button').addClass("next-btn").click(function(){
				var args = new Object();
				args.carSelected = section;
				$('#footer-go-button').unbind();
				instance.main.scoringSystem.addOperatingCosts(instance.refundCost);
				instance.main.navigateForward(instance, forwardLocation, args);
				setTimeout( function(){ carPreview.remove() }, 500 );
				soundManager.play('spent', { volume : 50 });
				// get rid of the selected class so the buttons are in correct state if the user comes back
				$('.select-button').removeClass("selected");
			});
			
    		instance.main.bottomNavigation.enableGoButton();
			
			soundManager.play('air_drill', { volume : 30 });
		}).appendTo(btn);
        
		return tempSelection;
	};

	Utilities.fillAttrMeters = function(attrs,option,stats,typeStats) {

		for( var i = 0; i < 4; i++ )
		{
			selectorString = 'div[id|=' + option + '-' + i + "-option-row-rating-section" + stats + ']';

			var scale = attrs[i] * 10;

			if( scale > 100 )
				scale = 100;

			typeStats.find(selectorString).transition({ 'width' : scale + '%'}, 500);
		}
	};
	
	Utilities.createAbsoluteDivElement = function(img, width, height) {
		var domElement = document.createElement('div');

		if ( img != null )
		{
			domElement.style.background = 'url('+img.src+')'; 
		}

		domElement.style.position = 'absolute';
		domElement.style.display = 'block'; 

		if ( width != null )
		{
			domElement.style.width = width+"px"; 
		}

		if ( height != null )
		{
			domElement.style.height = height+"px";
		}
		
		domElement.style.top = "0px"; 
		domElement.style.left = "0px"; 

		return domElement;
	};

    Utilities.createNavigationPane = function(currentPage, content) {
        var popup = new NavPanePopup();
        
        var navPane = $("<div />").attr({
            id: "main-wrapper-navigation-pane"
        });
        
        $("<h3 />").addClass("span999").appendTo(navPane);
        $("<div />").addClass("span999").appendTo(navPane);
        
        navPane.appendTo("#main-wrapper-content");
        
        navPane.hover(function(){
            $(this).find('div').addClass("hover");
        },
        function(){
            $(this).find('div').removeClass("hover");
        });
                
        navPane.click(function(){
            $(this).find('div').addClass("click");
            popup.create("nav-pane-popup");
            popup.distributeContent(content);
            popup.base.appendTo("#main-wrapper-content").show();
        });

        document.getElementById("main-wrapper-navigation-pane").addEventListener('touchstart', function(){
            $('this').find('div').addClass("click");
        });
        
        document.getElementById("main-wrapper-navigation-pane").addEventListener('touchend', function(){
            $('this').find('div').removeClass("click");
        });
        
        return navPane;
    };

    Utilities.removeNavigationPane = function(){
        $("#main-wrapper-navigation-pane").remove();
    };

    Utilities.changeNavigationPaneCss = function(className){
        $("#main-wrapper-navigation-pane").removeClass().addClass(className);
    };

	Utilities.createSmallCarPreview = function(option, stats, buildType, main) {

		var tempSelection = $('<div />').addClass( 'car-preview-block' ).attr({'id' : 'car-preview-block'});
		
		var display = $('<div />').addClass( 'small-display' ).appendTo(tempSelection);
		$('<img />').addClass('chassis').attr({'id' : 'car-preview-chassis-display'}).appendTo(display);
		$('<img />').addClass('brakes').attr({'id' : 'car-preview-brakes-display'}).appendTo(display);
		$('<img />').addClass('wheels').attr({'id' : 'car-preview-wheels-display'}).appendTo(display);
		$('<img />').addClass('spoiler').attr({'id' : 'car-preview-spoiler-display'}).appendTo(display);
		$('<img />').addClass('roll-bar').attr({'id' : 'car-preview-supportBar-display'}).appendTo(display);
		$('<img />').addClass('shocks').attr({'id' : 'car-preview-shocks-display'}).appendTo(display);

		if( main.carBuild.chassis != null )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'chassis', main.carBuild.chassis );
		}
		if( main.carBuild.brakes != null )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'brakes', main.carBuild.brakes );
		}
		if( main.carBuild.wheels != null )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'wheels', main.carBuild.wheels );
		}
		if( main.carBuild.spoiler )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'spoiler', '' );
		}
		if( main.carBuild.shocks )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'shocks', '' );
		}
		if( main.carBuild.roll_bar )
		{
			Utilities.addSmallPreviewImage( tempSelection, 'supportBar', '' );
		}

		return tempSelection;
	};

	Utilities.addSmallPreviewImage = function(previewContainer, partType, partIndex) {
		var temp = previewContainer.find('img[id|=car-preview-' + partType + '-display]');

		if( temp.css('opacity') == 0 )
		{
			temp.attr({ 'src' : 'images/CarAssets/CarPreview/' + partType + partIndex + '.png'}).transition({ 'opacity' : 1 }, 500 );
		} else {
			temp.transition({ 'opacity' : 0 }, 250, function(){
				temp.attr({ 'src' : 'images/CarAssets/CarPreview/' + partType + partIndex + '.png'}).transition({ 'opacity' : 1 }, 250 );
			})
		}
	};

	Utilities.removeSmallPreviewImage = function(previewContainer, partType, partIndex) {
		var temp = previewContainer.find('img[id|=car-preview-' + partType + '-display]');

		if( temp.css('opacity') == 1 )
		{
			temp.attr({ 'src' : 'images/CarAssets/CarPreview/' + partType + partIndex + '.png'}).transition({ 'opacity' : 0 }, 500 );
		} else {
			temp.transition({ 'opacity' : 1 }, 250, function(){
				temp.attr({ 'src' : 'images/CarAssets/CarPreview/' + partType + partIndex + '.png'}).transition({ 'opacity' : 0 }, 250 );
			})
		}
	};

	Utilities.createLargeCarPreview = function(option, stats, buildType, main) {
		var tempSelection = $('<div />').addClass( 'car-preview-block' );
		
		var display = $('<div />').addClass( 'large-display' ).appendTo(tempSelection);
		$('<img />').addClass('chassis').attr({'id' : 'car-preview-chassis-display'}).appendTo(display);
		$('<img />').addClass('brakes').attr({'id' : 'car-preview-brakes-display'}).appendTo(display);
		$('<img />').addClass('wheels').attr({'id' : 'car-preview-wheels-display'}).appendTo(display);
		$('<img />').addClass('spoiler').attr({'id' : 'car-preview-spoiler-display'}).appendTo(display);
		$('<img />').addClass('roll-bar').attr({'id' : 'car-preview-supportBar-display'}).appendTo(display);
		$('<img />').addClass('shocks').attr({'id' : 'car-preview-shocks-display'}).appendTo(display);

		if( main.carBuild.chassis != null )
		{
			Utilities.addLargePreviewImage( tempSelection, 'chassis', main.carBuild.chassis );
		}
		if( main.carBuild.brakes != null )
		{
			Utilities.addLargePreviewImage( tempSelection, 'brakes', main.carBuild.brakes );
		}
		if( main.carBuild.wheels != null )
		{
			Utilities.addLargePreviewImage( tempSelection, 'wheels', main.carBuild.wheels );
		}
		if( main.carBuild.spoiler )
		{
			Utilities.addLargePreviewImage( tempSelection, 'spoiler', '' );
		}
		if( main.carBuild.shocks )
		{
			Utilities.addLargePreviewImage( tempSelection, 'shocks', '' );
		}
		if( main.carBuild.roll_bar )
		{
			Utilities.addLargePreviewImage( tempSelection, 'supportBar', '' );
		}

		return tempSelection;
	};

	Utilities.addLargePreviewImage = function( previewContainer, partType, partIndex ) {
		var temp = previewContainer.find('img[id|=car-preview-' + partType + '-display]');

		if( temp.css('opacity') == 0 )
		{
			temp.attr({ 'src' : 'images/CarAssets/CarPreviewLarge/' + partType + partIndex + '.png'}).transition({ 'opacity' : 1 }, 500 );
		} else {
			temp.transition({ 'opacity' : 0 }, 250, function(){
				temp.attr({ 'src' : 'images/CarAssets/CarPreviewLarge/' + partType + partIndex + '.png'}).transition({ 'opacity' : 1 }, 250 );
			})
		}
	};  
	
	Utilities.toggleLeadGenContent = function( contentContainer) {
		var sel = contentContainer.find('select');
		var installed = contentContainer.find('.installed');
		
		if( sel.css('display') == 'none')
		{
			// user must have canceled the Installed option
			// TODO: animating has side effect of 'modifications-page-lead-gen' div resizing during transition
//			sel.show( 250, function(){
//				installed.hide( 250);
//			});
			installed.hide();
			sel.show();
			// reset the selected option to default
			sel.removeAttr('selected').find('option:first').attr('selected', 'selected');
		} else {
			// user just made a selection
//			sel.hide( 250, function(){
//				installed.show( 250);
//			});
			sel.hide();
			installed.show();
		}
	};  

	Utilities.resetLeadGenContent = function( contentContainer ) {
		var sel = contentContainer.find('select');
		var installed = contentContainer.find('.installed');

		if( sel.css('display') == 'none' )
		{
			installed.hide();
			sel.show();

			sel.removeAttr('selected').find('option:first').attr('selected', 'selected');
		}
	};
    
    Utilities.setSelectedButtonClass = function(button){
        var buttons = $('.select-button');
        
        for(var i=0; i<buttons.length; i++){
            $(buttons[i]).removeClass("selected");            
        }
        
        button.addClass("selected");
    };

    Utilities.fadeSoundOut = function(soundId, nextSoundId, nextSoundIdOptions){
    	var soundInterval = setInterval( function(){ 
				var buildMusicVolume = soundManager.getSoundById(soundId).volume;
				soundManager.setVolume( soundId, buildMusicVolume - 5 );
			}, 50 );

			setTimeout( function(){ 
				clearInterval( soundInterval );
				soundManager.stop(soundId); 

				if( nextSoundId != null )
					soundManager.play(nextSoundId, nextSoundIdOptions);
			}, 1000 );
    };
    
    Utilities.countdown = function(countdownEle, duration){
    	var i = duration;
    	
        var countOnce = setInterval( function(){ 
    		countdownEle.text( --i);
            }, 1000 );

		setTimeout( function(){ 
			clearInterval( countOnce);
 		}, (duration+1)*1000 );
    };
    
	window.Utilities = Utilities;

} (window));