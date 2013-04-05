(function (window) {
	function StuckPopup() {
//	   this.inital = new Popup(attrid);
        Popup.apply(this, arguments);
	};

    StuckPopup.prototype = new Popup();

    StuckPopup.prototype.parent = Popup.prototype;
    
    StuckPopup.prototype.distributeContent = function(popupContent){
        this.parent.distributeContent.call(this, popupContent);
        var content = popupContent;
        
        if ( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
        {
            $("<span />").text(window.main.CURRENCY_SYMBOL + content.oem_cost).addClass("money").appendTo(this.upper);
        }
        else
        {
            $("<span />").text("-" + window.main.CURRENCY_SYMBOL + content.cost).addClass("money").appendTo(this.upper);
        }
        $("<p />").text(content.explanation).appendTo(this.upper);
        var counterDiv = $("<div />").addClass("counter").appendTo(this.lower);
        var titleDiv = $("<div />").addClass("span200").appendTo(counterDiv);
        $("<span />").addClass("repaired-in").text(content.countdown_title).appendTo(titleDiv);
        var countDiv = $("<div />").addClass("span999").appendTo(counterDiv);
        $("<span />").text("3").addClass("countdown").appendTo(countDiv);
        $("<div />").addClass("clearfix").appendTo(counterDiv);
    };
    
	window.StuckPopup = StuckPopup;

} (window));