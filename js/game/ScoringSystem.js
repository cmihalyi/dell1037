(function (window) {
	function ScoringSystem(){
//		console.log("Score Constructor");
		this.reset();

		this.initialValue = 0;
	};

	ScoringSystem.prototype.reset = function() {
		this.score = this.initialValue;
		this.profits = 0;
		this.operatingCosts = 0;
		this.outOfMoney = false;

		this.cachedScore = 0;
		this.cachedProfits = 0;
		this.cachedOperatingCosts = 0;

		window.main.bottomNavigation.resetMoneyTo(this.initialValue);
	};

	ScoringSystem.prototype.setInitialInvestment = function(initialValue) {
		this.score = initialValue;
		this.initialValue = initialValue;
	};

	ScoringSystem.prototype.getScore = function() {
		return this.score;
	};

	ScoringSystem.prototype.addProfits = function(profits) {
		window.main.bottomNavigation.updateMoney(profits);
		this.profits += profits;
	};

	ScoringSystem.prototype.getProfits = function() {
		return this.profits;
	};

	ScoringSystem.prototype.addOperatingCosts = function(operatingCosts) {
		if ( this.score + this.profits - this.operatingCosts - operatingCosts <= 0 )
		{
			this.outOfMoney = true;
			return;
		}
		window.main.bottomNavigation.updateMoney(-operatingCosts);
		this.operatingCosts += operatingCosts;
	};

	ScoringSystem.prototype.setCache = function () {
		this.cachedScore = this.score
		this.cachedProfits = this.profits;
		this.cachedOperatingCosts = this.operatingCosts;
		this.outOfMoney = false;

//		console.log('ScoringSystem -- setCache()');
	};

	ScoringSystem.prototype.resetToCached = function() {
//		console.log(this);
//		console.log(this.getRevenue());
		window.main.bottomNavigation.resetMoneyTo(this.cachedScore - this.cachedOperatingCosts);

		this.score = this.cachedScore;
		this.profits = this.cachedProfits;
		this.operatingCosts = this.cachedOperatingCosts;
		this.outOfMoney = false;

//		console.log(this);
//		console.log(window.main.bottomNavigation.amountOfMoney);
	};

	ScoringSystem.prototype.getOperatingCosts = function() {
		return this.operatingCosts;
	};

	ScoringSystem.prototype.getRevenue = function() {
		return revenue = this.score + this.profits - this.operatingCosts;
	};

	window.ScoringSystem = ScoringSystem;

} (window));