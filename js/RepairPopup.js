(function (window) {
	function RepairPopup() {
//	   this.inital = new Popup(attrid);
        Popup.apply(this, arguments);
	};

    RepairPopup.prototype = new Popup();

    RepairPopup.prototype.parent = Popup.prototype;
    
    RepairPopup.prototype.distributeContent = function(popupContent){
        this.parent.distributeContent.call(this, popupContent);
        var content = popupContent;
        
        if ( window.main.carBuild.buildPathName == window.main.BUILD_TYPE_OEM )
        {
            $("<span />").text(window.main.CURRENCY_SYMBOL + content.cost).addClass("money").appendTo(this.upper);
        }
        else
        {
            $("<span />").text("-" + window.main.CURRENCY_SYMBOL + content.cost).addClass("money").appendTo(this.upper);
        }
        $("<p />").text(content.explanation).appendTo(this.lower);
        var counterDiv = $("<div />").addClass("counter").appendTo(this.lower);
        var titleDiv = $("<div />").addClass("span200").appendTo(counterDiv);
        $("<span />").addClass("repaired-in").text(content.countdown_title).appendTo(titleDiv);
        var countDiv = $("<div />").addClass("span999").appendTo(counterDiv);
        $("<span />").text("3").addClass("countdown").appendTo(countDiv);
        $("<div />").addClass("clearfix").appendTo(counterDiv);
    };
    
	window.RepairPopup = RepairPopup;

} (window));