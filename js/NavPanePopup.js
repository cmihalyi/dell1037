(function (window) {
	function NavPanePopup() {
        Popup.apply(this, arguments);
//        console.log("NavPanePopup Constructor");
	};

    NavPanePopup.prototype = new Popup();

    NavPanePopup.prototype.parent = Popup.prototype;
    
    NavPanePopup.prototype.distributeContent = function(popupContent){
        this.parent.distributeContent.call(this, popupContent);
        var popup = this.base;
        var content = popupContent;
        
        $("<p />").text(content.body).appendTo(this.upper);
        $("<button />").text(content.cancel_button).addClass("select-button").click(function(){
            popup.remove();
            $("#main-wrapper-navigation-pane div").removeClass("click");
        }).appendTo(this.lower);
        
        $("<button />").text(content.go_button).addClass("select-button").click(function(){
            popup.remove();
            main.scoringSystem.reset();
            main.carBuild.reset();
            main.navigateBackward(main.pages[main.currentLocation], main.BUILD_PATH_SELECTION_PAGE);
        }).appendTo(this.lower);
    };
    
	window.NavPanePopup = NavPanePopup;

} (window));