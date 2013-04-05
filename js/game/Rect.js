(function (window){
	function Rect(x, y, w, h){
		this.x = x; // x pos
		this.y = y; // y pos
		this.w = w; // width
		this.h = h; // height

		this.topLeft = new Object();
		this.topLeft.x = this.x;
		this.topLeft.y = this.y;

		this.topRight = new Object();
		this.topRight.x = this.x + this.w;
		this.topRight.y = this.y;

		this.bottomLeft = new Object();
		this.bottomLeft.x = this.x;
		this.bottomLeft.y = this.y + this.h;

		this.bottomRight = new Object();
		this.bottomRight.x = this.x + this.w;
		this.bottomRight.y = this.y + this.h;

		this.center = new Object();
		this.center.x = ( this.x + this.w ) / 2;
		this.center.y = ( this.y + this.h ) / 2;
	};

	Rect.prototype.contains = function(x, y) {
		return ( x > this.x && x < ( this.x + this.w ) && y > this.y && y < ( this.y + this.h ) ) ? true : false;
	};

	window.Rect = Rect;
}(window));