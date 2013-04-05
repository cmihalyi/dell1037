(function (window) {
	function CssLayer(name, w, h) {
		this.name = name;
		var domElement = this.domElement;
		this.width = w || 0; 
		this.height = h || 0;
		this.x = 0; 
		this.y = 0; 
		this.offsetX = 0; 
		this.offsetY = 0; 
		this.rotation = 0;

		this.images = new Array();
		
		if(!this.domElement)
		{
			this.domElement = document.createElement('div');

			this.domElement.style.position = 'absolute';
			this.domElement.style.display = 'block'; 
			this.domElement.style.width = this.width+"px"; 
			this.domElement.style.height = this.height+"px";
			this.domElement.style.top = "0px"; 
			this.domElement.style.left = "0px"; 	
		}
	};

	CssLayer.prototype.addImage = function(img, width, height, offsetX, offsetY, z) {
		var css_img = new CssImage(img, width, height, offsetX, offsetY);
		if( z != null ) css_img.domElement.style.zIndex = z;

		this.images[img] = img.src.hashCode();
		$(css_img.domElement).appendTo($(this.domElement));
	};

	CssLayer.prototype.addImageAtXY = function(img, width, height, x, y, id, z) {
		var css_img = new CssImage(img, width, height, 0, 0);
		css_img.x = x; 
		css_img.y = y;
		css_img.domElement.id = id;
		if( z != null ) css_img.domElement.style.zIndex = z;

		css_img.update();
		this.images[img.src.hashCode()] = css_img;

		// var tmpStr = (String(css_img.domElement.style.background));
		// console.log("TmpStr = " + tmpStr);
		// console.log("AddImageAtXY - img: " + img.src.hashCode() + ", cssImg: " + tmpStr.substr(4, tmpStr.length-5).hashCode());
		$(css_img.domElement).appendTo($(this.domElement));
	};

	CssLayer.prototype.removeImage = function(img) {
		//console.log("RemoveImage = " + img.src);
		var cssImg = this.images[img.src.hashCode()];
		// var tmpStr = (String(cssImg.domElement.style.background));
		// console.log("REMOVE IMAGE - img: " + img.src.hashCode() + ", cssImg: " + tmpStr.substr(4, tmpStr.length-5).hashCode());
		//console.log(cssImg.domElement.id);

		if ( cssImg != null )
		{
			$(cssImg.domElement).detach();
		}
	};

	CssLayer.prototype.removeImageById = function(id) {
		$('#' + id ).remove();
	};

	CssLayer.prototype.reAttachImage = function(img) {
		var cssImg = this.images[img.src.hashCode()];

		$(cssImg.domElement).appendTo($(this.domElement));
	};
	
	CssLayer.prototype.update = function() {
			
		var dom = this.domElement; 	
	
		if( $.browser.msie && $.browser.version < 10 )
	 		styleStr = "translate("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px)";
	 	else
	 		styleStr = "translate3d("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px, 0px)"; 
		
		// console.log("Rotation: " + this.rotation);
	 	if ( this.rotation < 0 || this.rotation > 0 )
	 	{
	 		// console.log("Rotation: " + this.rotation);
	 		styleStr += " rotate("+this.rotation+"deg)";
	 	}

		dom.style.webkitTransform = dom.style.MozTransform = dom.style.OTransform = dom.style.msTransform = dom.style.transform = styleStr; 		
	};

	window.CssLayer = CssLayer;
	
} (window));