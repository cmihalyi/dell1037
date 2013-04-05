(function (window) {

	function Somnio() {};

	Somnio.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	Somnio.roundNumber = function(num, dec) {
		if (num == "null")
			return "null";
		return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	};

	Somnio.getAngle = function( x1, y1, x2, y2 ) {
		var deltaY = y2 - y1;
		var deltaX = x2 - x1;

		return Math.atan2(deltaY, deltaX) * ( 180 / Math.PI );
	};

	String.prototype.hashCode = function()
	{
	    var hash = 0, i, char;
	    if (this.length == 0) return hash;
	    for (i = 0; i < this.length; i++) {
	        char = this.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	};

	window.Somnio = Somnio;

} (window));