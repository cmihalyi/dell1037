(function (window) {

	function BottomNavigation(main) {
		this.root = null;
		this.amountOfMoney = 0;
		this.main = main;
	};

	BottomNavigation.prototype.create = function() {
		this.root = $('<div />').attr('id', 'bottom-navigation-footer');
		var previousButtonDiv = $('<div />').addClass('span4').appendTo(this.root);
		$('<button />').attr('id', 'footer-previous-button').appendTo(previousButtonDiv);
		var bottomMoney = $('<div />').attr('id', 'bottom-money-container').addClass('span4').appendTo(this.root);
		$('<span />').attr('id', 'bank-text').appendTo(bottomMoney);
		$('<span />').attr('id', 'currency-symbol').appendTo(bottomMoney);
		$('<span />').attr('id', 'user-money').appendTo(bottomMoney);
		var goButtonDiv = $('<div />').addClass('span4').appendTo(this.root);
		$('<button />').attr({
            id: "footer-go-button",
            disabled: "disabled"
		}).appendTo(goButtonDiv);
		$('<div />').addClass('clearfix').appendTo(this.root);
	};

	BottomNavigation.prototype.distributeContent = function(content) {
		if ( this.root != null )
		{
			$('#bank-text').text(content.bank_text);
			$('#currency-symbol').text(this.main.CURRENCY_SYMBOL);
			$('#user-money').text(content.initial_money);
			this.amountOfMoney = parseInt(content.initial_money);
			this.main.scoringSystem.setInitialInvestment(this.amountOfMoney);
			$('#footer-go-button').html(content.forward_button);
			$('#footer-previous-button').html(content.previous_button);
		}
	};

	BottomNavigation.prototype.attach = function() {
		this.root.appendTo('#main-wrapper-content-footer');
	};

	BottomNavigation.prototype.detach = function() {
		this.root.detach();
	};

	BottomNavigation.prototype.showGoButton = function() {
		$('#footer-go-button').show();
	};

	BottomNavigation.prototype.hideGoButton = function() {
		$('#footer-go-button').hide();
	};

    BottomNavigation.prototype.disableGoButton = function(){
		$('#footer-go-button').attr("disabled", "disabled");
    };
    
    BottomNavigation.prototype.enableGoButton = function(){
		$('#footer-go-button').removeAttr("disabled");
    };
    
	BottomNavigation.prototype.showPreviousButton = function() {
		$('#footer-previous-button').show();
	};

	BottomNavigation.prototype.hidePreviousButton = function() {
		$('#footer-previous-button').hide();
	};

	BottomNavigation.prototype.updateMoney = function(amount) {
		this.amountOfMoney += amount;
		$('#user-money').text(this.amountOfMoney);
	};

	BottomNavigation.prototype.resetMoneyTo = function(amount) {
		this.amountOfMoney = amount;
		$('#user-money').text(amount);
	};

	BottomNavigation.prototype.hide = function() {
		var instance = this;
		this.root.transition({ 'opacity' : 0 }, 500, function(){
			instance.root.hide();
		});
	};

	BottomNavigation.prototype.show = function() {
		var instance = this;

		this.root.show();
		this.root.transition({ 'opacity' : 1 }, 500);
	};

	window.BottomNavigation = BottomNavigation;

} (window));