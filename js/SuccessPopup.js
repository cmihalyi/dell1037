(function (window) {
	function SuccessPopup() {
        Popup.apply(this, arguments);
//        console.log("SuccessPopup Constructor");
	};

    SuccessPopup.prototype = new Popup();

    SuccessPopup.prototype.parent = Popup.prototype;
    
    SuccessPopup.prototype.distributeContent = function(popupContent){
        this.parent.distributeContent.call(this, popupContent);
        var content = popupContent;
        
//        console.log(main);

        $("<p />").text(content.body).appendTo(this.upper);
        $("<span />").addClass("money").appendTo(this.upper);
        $("<button />").text(content.continue_button).addClass("select-button").click(function(){
            main.navigateForward(main.pages[main.RACE_PAGE], main.METAPHOR_PAGE);
            if ( $.client.os != "iPad" )
            {
                Utilities.fadeSoundOut('music_race', 'music_build', { volume : 100 }); 
            }
        }).appendTo(this.lower);       
    };
    
	window.SuccessPopup = SuccessPopup;

} (window));