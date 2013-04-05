(function (window) {
	function CssGameRenderer(rootLayer) {
//		console.log("CssGameRenderer Constructor");
		this.layers = new Array();
		this.rootLayer = rootLayer;
	};

	CssGameRenderer.prototype.createLayer = function(name, attachTo) {
		var layer = new CssLayer(name);
		this.layers[name] = layer;
		if ( attachTo != null )
		{
			$(layer.domElement).appendTo($(this.getLayer(attachTo).domElement));
		}
		else
		{
			$(layer.domElement).appendTo(this.rootLayer);
		}
	};

	CssGameRenderer.prototype.appendToLayer = function(layerName, domElement) {
		domElement.appendTo($(this.layers[layerName].domElement));
	};

	CssGameRenderer.prototype.getLayer = function(name) {
		return this.layers[name];
	};

	window.CssGameRenderer = CssGameRenderer;

} (window));