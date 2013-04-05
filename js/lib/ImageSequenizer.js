/**

MIT LICENSE

ImageSequenizer.js

Copyright (C) 2012 - Ryan Ploetz

LinkedIn: http://www.linkedin.com/in/ploetz
Email: rploetz@somnio.com
Version: 0.0.1

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

** How to use this library **

// create a new image sequenizer
var img = new ImageSequenizer(this.imageStartSequenceName , ".png", 140, false, true, 30, 'tag-name', function(){
	console.log("callback!");
});

// attach the created image tag to your DOM.
img.getElement().appendTo($('#foo'));

// enjoy!

**/

(function (window) {

	function ImageSequenizer(imageFileName, extension, totalImages, loop, autostart, fps, tagID, finishedCallback, args, frameActions) {

		this.loader = new PxLoader();
		this.images = new Array();
		for ( var i = 1; i <= totalImages; i++ )
		{
			this.images.push(this.loader.addImage(imageFileName + i + extension));
		}
		
		this.imageFile = imageFileName;
		this.extension = extension;
		this.totalImages = totalImages;
		this.auto = autostart || true;
		this.fps = fps || 12;
		this.tag = tagID || null;
		this.loop = loop || true;
		this.callback = finishedCallback || null;
		this.args || null;
		this.frameActions = frameActions || null;

		this.intervalId = null;
		this.nextImageId = 0;

		this.root = $('<img />');

		if ( this.tag != null )
		{
			this.root.attr('id', this.tag);
		}

		var instance = this;

		this.loader.addCompletionListener(function(){
			if ( instance.auto )
			{
				instance.start();
			}
		});

		this.loader.start();
	};

	ImageSequenizer.prototype.getElement = function() {
		return this.root;
	};

	ImageSequenizer.prototype.start = function() {
		var instance = this;
		this.intervalId = setInterval(function() {
			instance.nextImageId++;

			if( instance.frameActions != null )
			{
				if( instance.frameActions.actions[instance.nextImageId] != null )
				{
					if( instance.frameActions.actions[instance.nextImageId].action != null )
					{
						instance.frameActions.actions[instance.nextImageId].action();
					}
				}	
			}

			if ( instance.callback != null && instance.nextImageId > instance.totalImages )
			{
				instance.stop();
				instance.callback.apply(instance, instance.args);
				return;
			}

			instance.root.attr('src', instance.imageFile + instance.nextImageId + instance.extension);
		}, 1000 / this.fps);
	};

	ImageSequenizer.prototype.stop = function() {
		clearInterval(this.intervalId);
	};

	window.ImageSequenizer = ImageSequenizer;

} (window));