(function (window){
	function ImageActions(){
		this.actions = new Array();
	};

	ImageActions.prototype.addAction = function( frameIndex, action ){
		this.actions[frameIndex] = new Object();
		this.actions[frameIndex].action = action;
	};

	window.ImageActions = ImageActions;
}(window));