(function (window) {
	function FailPopup() {
        Popup.apply(this, arguments);
//        console.log("FailPopup Constructor");
	};

    FailPopup.prototype = new Popup();

    FailPopup.prototype.parent = Popup.prototype;
    
    FailPopup.prototype.distributeContent = function(popupContent){
        this.parent.distributeContent.call(this, popupContent);
        var content = popupContent;

        $("<p />").text(content.body).appendTo(this.upper);
        //$("<div />").addClass("span999").appendTo(this.lower);
        //$("<div />").addClass("span999").appendTo(this.lower);
        //$("<div />").addClass("span999").appendTo(this.lower);
        //$("<div />").addClass("clearfix").appendTo(this.lower);

        //$("<button />").text(content.restart_button).addClass("select-button").click(function(){
          //  window.main.pages[window.main.RACE_PAGE].race.reset();
        //}).appendTo(this.lower.find('div:nth-child(1)'));
        //$("<button />").text(content.new_car_button).addClass("select-button").click(function(){
          //  main.navigateForward(main.pages[main.RACE_PAGE], main.BUILD_PATH_SELECTION_PAGE);        
        //}).appendTo(this.lower.find('div:nth-child(2)'));
        $("<button />").text(content.continue_button).addClass("select-button").click(function(){
            main.navigateForward(main.pages[main.RACE_PAGE], main.METAPHOR_PAGE);    
            if ( $.client.os != "iPad" )
            {
                Utilities.fadeSoundOut('music_race', 'music_build', { volume : 100 } );    
            }
        }).appendTo(this.lower);
    };
    
	window.FailPopup = FailPopup;

} (window));