(function (window) {
	function Popup(){
	};

    Popup.prototype.create = function(attrid){
        this.base = $('<div />').attr({ "id" : attrid, "class" : "popup" }).hide();
        var banner = $('<div />').attr("class", "banner" ).appendTo(this.base);
        var modal = $('<div />').attr("class", "modal").appendTo(this.base);
        
        this.leftBanner = $('<p />').attr("class", "").appendTo(banner);
        this.rightBanner = $('<p />').attr("class", "").appendTo(banner);
        this.title = $('<h3 />').attr("class", "").appendTo(modal);
        this.upper = $('<div />').attr("class", "first").appendTo(modal);
        this.lower = $('<div />').attr("class", "second").appendTo(modal);
    };

    Popup.prototype.distributeContent = function(popupContent){
        var content = popupContent;
        var bannerContent = main.jsonContent.popups.oem_banner_messaging;

        var i = Somnio.getRandomInt(0,bannerContent.length-1);
        var j = (i + 2) % bannerContent.length;
        this.leftBanner.text(bannerContent[i]);
        this.rightBanner.text(bannerContent[j]);
        this.title.text(content.title);
    };

	window.Popup = Popup;

} (window));