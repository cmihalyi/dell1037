(function (window) {
	function Item(key, value) {
		console.log("Item Constructor - " + key + ", " + value);
		this.key = key;
		this.value = value;
	};

	window.Item = Item;

} (window));