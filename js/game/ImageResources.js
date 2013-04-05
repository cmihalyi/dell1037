(function (window) {
	function ImageResources() {
//		console.log("ImageResources Constructor");
		this.loader = new PxLoader();

		this.images = new Array();
		this.foregroundImages = new Array();

		this.images["background_sky"] = this.loader.addImage('images/GameEnvironment/sky.png');
		this.images["foreground_ground"] = this.loader.addImage('images/GameEnvironment/foreground.png');
		this.images["gold_coin"] = this.loader.addImage('images/collectables/gold_coin.png');
		this.images["silver_coin"] = this.loader.addImage('images/collectables/silver_coin.png');
		this.images["copper_coin"] = this.loader.addImage('images/collectables/copper_coin.png');
		this.images["garbage_can"] = this.loader.addImage('images/obstacles/garbage_can.png');
		this.images["brake_flag"] = this.loader.addImage('images/RaceAssets/raceHintFlag.png');
		this.images["brake_flag_start"] = this.loader.addImage('images/RaceAssets/raceHintStart.png');
		this.images["brake_flag_end"] = this.loader.addImage('images/RaceAssets/raceHintStop.png');

		this.images['chassis_1'] = this.loader.addImage('images/CarAssets/CanvasArt/chassis_1.png');
		this.images['chassis_2'] = this.loader.addImage('images/CarAssets/CanvasArt/chassis_2.png');
		this.images['chassis_3'] = this.loader.addImage('images/CarAssets/CanvasArt/chassis_3.png');
		this.images['chassis_4'] = this.loader.addImage('images/CarAssets/CanvasArt/chassis_4.png');

		this.images['wheel_1_left'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_1_left.png');
		this.images['wheel_1_right'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_1_right.png');
		this.images['wheel_2_left'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_2_left.png');
		this.images['wheel_2_right'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_2_right.png');
		this.images['wheel_3_left'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_3_left.png');
		this.images['wheel_3_right'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_3_right.png');
		this.images['wheel_4_left'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_4_left.png');
		this.images['wheel_4_right'] = this.loader.addImage('images/CarAssets/CanvasArt/wheel_4_right.png');

		this.images['spoiler'] = this.loader.addImage('images/CarAssets/CanvasArt/spoiler.png');
		this.images['driver'] = this.loader.addImage('images/CarAssets/CanvasArt/driver.png');
		this.images['support_bar'] = this.loader.addImage('images/CarAssets/CanvasArt/support_bar.png');

		this.images['brake_1'] = this.loader.addImage('images/CarAssets/CanvasArt/brake_1.png');
		this.images['brake_2'] = this.loader.addImage('images/CarAssets/CanvasArt/brake_2.png');
		this.images['brake_3'] = this.loader.addImage('images/CarAssets/CanvasArt/brake_3.png');
		this.images['brake_4'] = this.loader.addImage('images/CarAssets/CanvasArt/brake_4.png');
		this.images['shocks'] = this.loader.addImage('images/CarAssets/CanvasArt/shocks.png');

		var counter = 1;
		for ( var i = 0; i < 12; i++ )
		{
			this.foregroundImages[i] = new Array();
			for ( var j = 0; j < 25; j++ )
			{
				this.foregroundImages[i][j] = this.loader.addImage('images/GameEnvironment/foreground/gameLevel_-' + counter + '.png');
				this.foregroundImages[i][j].enabled = false;

				//console.log('i: ' + i + ', j: ' + j + ', counter: ' + counter);

				counter++;
			}
		}
	};


	ImageResources.prototype.loadImages = function() {
		this.loader.start();
	};

	window.ImageResources = ImageResources;

} (window));