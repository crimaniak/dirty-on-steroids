// Hавигатор справа
d3.addModule(
{
	type: "Навигация",
	name: 'Навигация по новым',
	author: 'crimaniak, Stasik0',
	config: {
		active:{type:'checkbox',value:true},
		smoothScroll:{type:'checkbox',value:true,caption:'Плавная прокрутка'}
	},
	newItems: [],
	mineItems: [],
	nextMine: null,
	nextNew: null,
	prevNew: null,
	currentItem: null,
	scrolling: false,
	scrollDestination: 0,
	run: function()
	{
		if(!this.countItems()) return;
		
		this.drawButtons();
		
		var me=this;
		$j(window).scroll(function(event){me.onScroll();});
		$j('#home').click(function(){me.scrollToPosition(0);});
		$j('#down').click(function(){me.scrollToItem(me.newItems[me.nextNew]);});
		$j('#up').click(function(){me.scrollToItem(me.newItems[me.prevNew]);});
		$j('#mine').click(function(){me.scrollToItem(me.mineItems[me.nextMine]);});
		
		d3.content.onNewComment(function(comment)
		{
			me.countItems();
			me.newPosition();
		});
		
		this.newPosition();
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
		this.scrollDeamon();
	},

	scrollDeamon: function(){
		var destination = this.scrollDestination;
		if(this.scrolling == false){
			scrolling = false;
			this.newPosition();
			return;
		}
		current = $j(window).scrollTop();
		distance = destination - current;
		if ( Math.abs(distance) < 5 ) {
			$j(window).scrollTop(destination);
			this.resetScrolling();
			this.newPosition();
			return;
		}
		$j(window).scrollTop(
			Math.round(current+(distance/4.5))
		);
		me = this;
		window.setTimeout(function(){me.scrollDeamon(destination)}, 35);
	},


	countItems: function()
	{
		var items = d3.get.items();
		this.newItems=[];
		this.mineItems=[];
		// select new and mine items
		for(var i=0;i<items.length;++i)
		{
			if(items[i].isNew) this.newItems.push(items[i]);
			if(items[i].isMine)this.mineItems.push(items[i]);
		}
		return true;
	},
/*
	onNewComment: function(comment)
	{
		this.countItems();
		this.newPosition();
	},
*/	



	scrollToItem: function(item)
	{
		var highlightColor = "#fff48d";
		var colorToHex =  function(color) {
		    if (color.substr(0, 1) === '#') {
			return color;
		    }
		    if(color.substr(0, 3) !== "rgb"){
			return "unknown";
		    }
		    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
		    
		    var red = parseInt(digits[2]);
		    var green = parseInt(digits[3]);
		    var blue = parseInt(digits[4]);
		    
		    var rgb = blue | (green << 8) | (red << 16);
		    return digits[1] + '#' + rgb.toString(16);
		};
		if(item==null) return false;
		this.scrolling=true;
		this.scrollToPosition(Math.floor(item.offset().top+(item.height()-$j(window).height())/2));
		this.currentItem=item;
		this.newPosition();
		/*
		item.getContent().get(0).style.opacity=0.1;
		item.getContent().animate({opacity: 1},400);
		*/
		var content=item.container;
		var inner = $j(".comment_inner", content);
		if(inner != null){ //is it a comment? if yes get a nested element for a better highlighting
			content = inner;
		}
		var oldColor=content.css('background-color');
		if(colorToHex(oldColor) == highlightColor)return;
		window.setTimeout(function(){content.css('background-color',oldColor);}, 650);
		content.css('background-color',highlightColor);
	},
	
	getCurrentOffset: function() {return this.currentItem ? this.currentItem.offset().top : $j(window).scrollTop()+$j(window).height()/2;},
	
	onScroll: function()
	{
	
		if(!this.scrolling){
			this.currentItem=null;
		}
		this.newPosition();
	},
	

	newPosition: function()
	{
		var offset = this.getCurrentOffset();
		var height=$j(window).height();

		for(var i=0; i< this.mineItems.length && this.mineItems[i].offset().top<=offset; ++i);
		$j('#mine').html(this.mineItems.length-i);
		this.nextMine = i<this.mineItems.length ? i : null;
		
		for(i=0; i<this.newItems.length && this.newItems[i].offset().top<offset; ++i);
		$j('#up').html(i);
		this.prevNew = i>0 ? i-1 : null;

		for(; i<this.newItems.length && this.newItems[i].offset().top<=offset; ++i);
		$j('#down').html(this.newItems.length-i);
		this.nextNew = i<this.newItems.length ? i : null;
	},
		
	drawButtons: function()
	{
			document.body.insertBefore(d3.newDiv(
			{style:{position:'fixed',top:'50%',marginTop:'-72px',right:'1px',zIndex:'100'}
			,innerHTML:'<div id="home" title="В начало страницы" style="height:36px; width:36px; color:#999999; background-image: url(http://pit.dirty.ru/dirty/1/2010/10/30/28281-204632-bb73ad97827cd6adc734021bf511df3b.png); cursor: pointer; cursor: hand; text-align:center;"></div>'
					+  '<div id="up" title="Предыдущий новый" style="height:22px; width:24px; color:#999999; background-image: url(http://pit.dirty.ru/dirty/1/2010/10/30/28281-204624-e6ddb7dc3df674a675eb1342db0b529a.png); cursor: pointer; cursor: hand; text-align:center; padding: 14px 0px 0px 12px;"></div>'
					+  '<div id="mine" title="Следующий мой" style="height:22px; width:24px; color:#999999; background-image: url(http://pit.dirty.ru/dirty/1/2010/10/30/28281-205202-7f74bf0a90bf664faa43d98952774908.png); cursor: pointer; cursor: hand; text-align:center; padding: 14px 0px 0px 12px;"></div>'
					+  '<div id="down" title="Следующий новый" style="height:22px; width:24px; color:#999999; background-image: url(http://pit.dirty.ru/dirty/1/2010/10/30/28281-205411-ceb943a765914621d0558fed8e5c5400.png); cursor: pointer; cursor: hand; text-align:center; padding: 14px 0px 0px 12px;"></div>'
			}), document.body.firstChild);
			var ids=['home','up','mine','down'];
			for(var i=0;i<ids.length;++i)
				$j('#'+ids[i]).unselectable();
	}
});
