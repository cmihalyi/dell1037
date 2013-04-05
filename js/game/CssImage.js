(function (window) {
	function CssImage(img, w, h, offsetX, offsetY, domElem, id) {
	
		var img = this.img = img; 
		var domElement = this.domElement = domElem;
		this.width = w; 
		this.height = h;
		this.scaleX = 1; 
		this.scaleY = 1; 
		this.x = 0; 
		this.y = 0; 
		this.offsetX = offsetX || 0; 
		this.offsetY = offsetY || 0; 
		
		if(!this.domElement)
		{
			this.domElement = document.createElement('div');

			this.domElement.style.background = 'url('+img.src+')'; 

			this.domElement.style.position = 'absolute';
			this.domElement.style.display = 'block'; 
			this.domElement.style.width = this.width+"px"; 
			this.domElement.style.height = this.height+"px";
			this.domElement.style.top = "0px"; 
			this.domElement.style.left = "0px"; 

			this.domElement.id = id;
		}
		this.update();
	};
	
	CssImage.prototype.update = function() {
			
		var dom = this.domElement; 	
	
	 // 	styleStr = "translate3d("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px, 0px) scale("+this.scaleX+","+this.scaleY+")"; 
	
		if( $.browser.msie && $.browser.version < 10 )
	 		styleStr = "translate("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px)";
	 	else
	 		styleStr = "translate3d("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px, 0px)"; 
	 	
		dom.style.webkitTransform = dom.style.MozTransform = dom.style.OTransform = dom.style.msTransform = dom.style.transform = styleStr; 		
	};

	window.CssImage = CssImage;
	
} (window));