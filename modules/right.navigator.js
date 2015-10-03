// Hавигатор справа
d3.addModule(
{
	type: "Навигация",
	name: 'Навигация по новым',
	author: 'crimaniak, Stasik0',
	config: {
		active:{type:'checkbox',value:1, description:'С правой стороны страницы появляется дополнительный навигатор, пользуясь которым, Вы можете перемещаться только по новым комментарим, либо только по своим, а также отмотать страницу вверх.'},
		smoothScroll:{type:'checkbox',value:1,caption:'Плавная прокрутка'}
		,transparency:{type:'text',value:'0',caption:'Прозрачность: ', description:'Может быть полезна на маленьких разрешениях, когда текст может оказаться под навигатором. В процентах, 0 - 50'}
	},
	newItems: [],
	mineItems: [],
	nextMine: null,
	nextNew: null,
	prevNew: null,
	currentItem: null,
	scrolling: false,
	scrollDestination: 0,
	onlyNew: false,
	run: function() {
		this.drawButtons();
		
		var me=this;
		$j(window).scroll(function(event){me.onScroll();});
		$j('#home').mousedown(function(e){e.preventDefault(); me.scrollToPosition(0);});
		$j('#down').mousedown(function(e){
			e.preventDefault(); 
			me.scrollToItem(me.nextNew); 
		});
		$j('#up').mousedown(function(e){
			e.preventDefault(); 
			me.scrollToItem(me.prevNew);
		});
		$j('#mine').mousedown(function(e){
			e.preventDefault(); 
			me.scrollToItem(me.nextMine);
		});
		var oldSwitch = d3.window.commentsHandler.switchNew;
		d3.window.commentsHandler.switchNew = function(){oldSwitch.apply(d3.window.commentsHandler);me.onlyNewTest();me.processNewPosition();};
	},

	onlyNewTest: function()
	{
		this.onlyNew = $j('#js-comments.new_only').length > 0;
	},
	
	onItemsUpdated: function () {
		this.newPosition();
	},

	onPost: function (post) {
		//this.countItem(post);
	},

	onComment: function (comment) {
		//this.countItem(comment);
	},

	scrollToPosition: function(position)
	{
		if(this.config.smoothScroll.value){
			this.smoothScroll(position);
		}else{
			$j(window).scrollTop(
				position
			);
			this.resetScrolling();
		}
	},

	resetScrolling: function() {
		this.scrolling = false;
	},

	smoothScroll: function(destination){
		this.scrollDestination = destination;
		this.scrolling = true;
		this.scrollDaemon();
	},

	scrollDaemon: function(lastPosition){
		lastPosition = typeof lastPosition !== 'undefined' ? lastPosition : -1;
		var destination = this.scrollDestination;
		if(this.scrolling == false){
			scrolling = false;
			this.newPosition();
			return;
		}
		current = $j(window).scrollTop();
		distance = destination - current;
		if (current==lastPosition || Math.abs(distance) < 5 || Math.round(current+(distance/3)) < 0) {
			$j(window).scrollTop(destination);
			this.resetScrolling();
			this.newPosition();
			return;
		}
		$j(window).scrollTop(
			Math.round(current+(distance/3))
		);
		var me = this;
		window.setTimeout(function(){me.scrollDaemon(current);}, 30);
	},

	countItem: function(item) {
		// select new and mine items
		var hidden = undefined;
		var changes = false;
		if (item.isNew) {
			if (hidden = item.container.is(":hidden")) {
				return false;
			}
			this.newItems.push(item);
			changes = true;
		}
		if (item.isMine) {
			if (hidden == undefined && item.container.is(":hidden")) {
				return false;
			}
			this.mineItems.push(item);
			changes = true;
		}
		return changes;
	},

	scrollToItem: function(itemNum)
	{
		if(itemNum == null) return false;
		item = d3.content.items()[itemNum];
		
		var highlightColor = "#fff48d";
		var colorToHex =  function(color) {
		    if (color.substr(0, 1) === '#') {
			return color;
		    }
		    if(color.substr(0, 3) !== "rgb"){
			return "unknown";
		    }

			if(color.substr(0, 4) === "rgba"){
				var digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				var alpha = parseInt(digits[5]);
				return '#'+(256 + red).toString(16).substr(1) +((1 << 24) + (green << 16) | (blue << 8) | alpha).toString(16).substr(1);
			}else if(color.substr(0, 3) === "rgb"){
				var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				
				var rgb = blue | (green << 8) | (red << 16);
				return digits[1] + '#' + rgb.toString(16);
			}
			return "unknown";
		};
		this.scrolling=true;
		this.scrollToPosition(Math.floor(item.offset().top+(item.height()-$j(window).height())/2));
		this.currentItem=item;
		this.newPosition();

		var content=item.container;

		var inner;
		if ( d3.content.variant == "dirty.ru")
		{
			inner = $j(".comment_inner", content);
		}
		else
		{
			inner = $j(".c_i", content);
		}

		if(inner!=null && inner.length > 0){ //is it a comment? if yes get a nested element for a better highlighting
			content = inner;
		}
		var oldColor=content.css('background-color');
		if(colorToHex(oldColor) != highlightColor){
			window.setTimeout(function(){content.css('background-color',oldColor);}, 650);
			content.css('background-color',highlightColor);
		}
	},
	
	getCurrentOffset: function() {return this.currentItem ? this.currentItem.offset().top+this.currentItem.height()/2 : $j(window).scrollTop()+$j(window).height()/2;},
	
	onScroll: function()
	{
		if(!this.scrolling){
			this.currentItem=null;
			this.newPosition();
		}
	},
	
	calculateStatus: function()
	{
		var currentOffset = this.getCurrentOffset();
		var status = {prev:0, next:0, mine:0, prevNew:null, nextNew:null, nextMine:null};
		
		var firstMine=null;
		var getData = function(item){
			var retval = {hidden:item.container.is(':hidden')};
			if(!retval.hidden) 
			{
				retval.top = item.container.offset().top;
				retval.bottom =retval.top + item.height();
			}	
			return retval;
		};
		
		$j.each(d3.content.items(), function(index, item)
		{
			var data = undefined;
			if(item.isNew)
			{
				if ((data = getData(item)).hidden) return;
				
				if(data.bottom < currentOffset)
				{
					status.prevNew = index;
					++status.prev;
				} 
				else if(data.top > currentOffset)
				{
					++status.next;
					if(status.nextNew===null) status.nextNew = index;
				}
			}
			if(item.isMine)
			{
				if(data == undefined && (data = getData(item)).hidden) return;

				if(!firstMine) firstMine = index;
				if(data.top > currentOffset)
				{
					++status.mine;
					if(status.nextMine===null) status.nextMine=index;
				}
			}
		});
		
		if(status.nextMine===null && firstMine) status.nextMine = firstMine;

		return status;
	},

	
	fireTimer: 0,
	newPosition: function()
	{
		var me = this;
		if(this.fireTimer) clearTimeout(this.fireTimer);
		this.fireTimer = setTimeout(function(){me.processNewPosition();}, 50);
	},
	
	processNewPosition: function()
	{
		var status = this.calculateStatus();
		$j('#mine').text(status.mine);
		$j('#up').text(status.prev);
		$j('#down').text(status.next);
		this.nextNew = status.nextNew;
		this.prevNew = status.prevNew;
		this.nextMine = status.nextMine;
	},
		
	drawButtons: function()
	{
        var opacity = 1;
        if (this.config.transparency.value) {
            var transparency = parseInt(this.config.transparency.value);
            if (transparency) {
                opacity = 1 - transparency/100;
                if (opacity < 0.5) {
                    opacity = 0.5;
                }
            }
        }
		document.body.insertBefore(d3.newDiv(
			{style:{position:'fixed',top:'50%',marginTop:'-72px',right:'1px',zIndex:'100',opacity:opacity}
			,innerHTML: '<div id="home" style="height:32px; width:32px; color:#ffffff; background-image: url(data:image/gif;base64,R0lGODlhIAAgAIAAALOzs////yH5BAAAAAAALAAAAAAgACAAAAIyhI+py+0Po5y02ouz3rx7GgSfEYZfWXYouq1r64qwy8WylgI5bur9CAwKh8Si8YhEFgAAOw==); cursor: pointer; cursor: hand; text-align:center; margin-bottom: 10px;"></div>'
            + '<div id="up" style="height:22px; width:32px; color:#ffffff; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeNJREFUeNrsl8tLAlEYxeeOM1oGxSCW44tESJLEpJZFLoISol0PEPLPat+ibNFqIKhVD4QIatHWJ4YPCvNFWljZuTGIRY/RKDdz4DB831w5P787d2BIs9lkFIqFm7KptPitUK/Xa3q9vob6pe2eYnEdrKUBBNYg2FQoFJay2WwgnU7XXS7XkcViOQTINe4/yeuJfP0WinQwAbp2EMH+fD4fTKVSs+gNy0FF+MLtdu8CRNLpdLdKp6EEgAZoETyF4FAymZxHbYP5TyZUIIScejyeLVEUT3ieL8v9rgBoMF8sFkcx6lUEr6Aeg/t+AH6GcyzLHni93m2TyXSu0Wjuv5rIVwBsqVQSEbyYSCTWUU/DQ237qkQNOMlx3L7P59sxGo1XgHr8CEIBSHuzXC4PIXguHo8HUc7AI/TBY7rXAxy12+17ZrM5bDAYYtim1olpTaBSqWgRPBmLxUIoA7D1k33+jehRvXQ4HGGASIIg5OiJIdVqdSCTydii0egyGmvwONzP/I3oP7+Dz5xOZ9hqtR4TSZI20XDDE7DQ4T53K/qg3tCJ0BfRBqz75T53KpolwgsUQM/0ThzL9FgqgAqgAqgAKoAKoAKoAD0HaH2cNhqNfw3GZ9t7AL/f/68AkUjk7foqwACX9rDUyu2FOQAAAABJRU5ErkJggg==); cursor: pointer; cursor: hand; text-align:center; padding: 10px 0px 0px 0px; font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);">0</div>'
            + '<div id="mine" style="height:18px; width:32px; color:#ffffff; background-image: url(data:image/gif;base64,R0lGODlhIAAgAIAAALOzs////yH5BAAAAAAALAAAAAAgACAAAAIvhI+py+0Po1QhTFnrhdnup33ieHQk1XknkGYr26pn+9b2jef6zvf+DwwKh8QisAAAOw==); cursor: pointer; cursor: hand; text-align:center; padding: 14px 0px 0px 0px; font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);"></div>'
            + '<div id="down" style="height:26px; width:32px; color:#ffffff; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdJJREFUeNrsl11LwmAUx93mC6yLElOYxjBEBDEho4sQQropgyjqG/U9uqgLiy4i8KLLKLCrbgqCLuYLwqZIvmRv0Mr1f+QZLBtkUBNiBw7jnD3P/r+dczZ4mHw+rzlgqqo6rDSXy9W/OvVEJpOxFKBQKHwG0BNWG+sYsdkANoANYAPYADaADWADDAXAMMxoATRN+98teCYvOQJtotlkut3utizLS5IkxZDwwjkLxF8ikchNKBTKMegvERQBsgyQ1WKxmEIcIGeHPxBWw+GwAuETr9e7g/iaoQPG0HYEOp1OularbQBkAfEU3P0Lwj1RFO+CweCFz+fbw1d1itx9X9hkwgnIRLvdngfIZqlUSiMOw3kK+iPjOO4hlUpd+f3+A5Zl80jJ8Hf6LE0HYOlQGGnIgrFWqzUDkLVyubyCOEpyw4BATE0mkxVBEI4AkUPqFv765R8zUAHOAKIZQNzNZjMKkK1KpZKlIONmA4vy9hKJRAPlPsMBdBepc/iT/sbfARhBHLRUxrUcQKbr9XoWIKQis/BJesbU4vH4Iwbs0uPx7CMm5W6Q/g9UVRsGQF/spBveTEAERVEWq9XqeiwWm4Nwl+f5Y9w/hEuDe0xa3LcPAQYAuF+uyd4wHk0AAAAASUVORK5CYII=); cursor: pointer; cursor: hand; text-align:center; padding: 6px 0px 0px 0px;  font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);"><br/></div>'
            }), document.body.firstChild);
	}
});
