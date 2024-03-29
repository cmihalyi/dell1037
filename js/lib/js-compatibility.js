(function(window){
	function Compatibility(){};

	Compatibility.run = function() {
		$(window).bind('error', function (e) {
		    // alert(e.originalEvent.message);
		});

		// HACK to avoid `console` errors in browsers that lack a console - in particular, IE8.
		if (!(window.console && console.log)) {
		  (function() {
		    var noop = function() {};
		    var methods = [
			    'assert', 
			    'clear', 
			    'count', 
			    'debug', 
			    'dir', 
			    'dirxml', 
			    'error', 
			    'exception', 
			    'group', 
			    'groupCollapsed', 
			    'groupEnd', 
			    'info', 
			    'log', 
			    'markTimeline', 
			    'profile', 
			    'profileEnd', 
			    'markTimeline', 
			    'table', 
			    'time', 
			    'timeEnd', 
			    'timeStamp', 
			    'trace', 
			    'warn'
		    ];
		    var length = methods.length;
		    var console = window.console = {};
		    while (length--) {
		        console[methods[length]] = noop;
		    }
		  }());
		}
	};

	window.Compatibility = Compatibility;
}(window));