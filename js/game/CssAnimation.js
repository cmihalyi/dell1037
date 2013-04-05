(function (window) {
	function CssAnimation(img, w, h, domElem) {
	
		var img = this.img = img; 
		var domElement = this.domElement = domElem;
		this.playing = true; 
		this.looping = true;
		this.width = w; 
		this.height = h;
		this.scaleX = 1; 
		this.scaleY = 1; 
		this.x = 0; 
		this.y = 0; 
		this.offsetX = 0; 
		this.offsetY = 0; 
		this.spriteSheetWidth = this.img.width; 
		this.numFrames = Math.floor(this.spriteSheetWidth/this.width);
		this.currentFrame = 0; 
		
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
		}
	};

	CssAnimation.prototype.enable = function(){
		this.domElement.style.display = 'block';
		this.looping = true;
		this.currentFrame = 0;
		this.play();
	};

	CssAnimation.prototype.disable = function() {
		this.domElement.style.display = 'none';
	};

	CssAnimation.prototype.gotoAndStop = function( framenum ) {
		this.currentFrame = framenum ;
		this.updateDom() ;
	};

	CssAnimation.prototype.update = function() {
		if( this.playing )
		{
			var nextFrame = this.currentFrame + 1 ;
			if( nextFrame >= this.numFrames )
			{
				if( this.looping ) this.gotoAndStop( 0 ) ;
				else
				{
					this.playing = false; 
					this.gotoAndStop( this.numFrames - 1 ) ; 
				}
			}
			else this.gotoAndStop( nextFrame ) ;			
		}
		else this.updateDom();
	};
	
	CssAnimation.prototype.updateDom = function() {
			
		var dom = this.domElement; 	
		var offset = this.currentFrame * this.width; 
	
		dom.style.background = 'url('+this.img.src+')'; 
		dom.style.width = this.width+"px"; 
		dom.style.height = this.height+"px";
		
		dom.style.backgroundPosition = offset +"px 0 ";
	
	 	if( $.browser.msie && $.browser.version < 10 )
	 		styleStr = "translate("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px)";
	 	else
	 		styleStr = "translate3d("+Math.round(this.x+this.offsetX)+"px, "+Math.round(this.y+this.offsetY)+"px, 0px)"; 
	
		dom.style.webkitTransform = dom.style.MozTransform = dom.style.OTransform = dom.style.msTransform = dom.style.transform = styleStr; 
		
	};

	CssAnimation.prototype.play = function(){
		this.playing = true; 
	};

	window.CssAnimation = CssAnimation;
	
} (window));