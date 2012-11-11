
// Ignore posts by ...
d3.addModule(
{
	type: "Социализм",
	name: 'Игноратор',
	author: 'crimaniak,Stasik0',
	config: {active:{type:'checkbox',value:true}
			,ignored:{type:'hidden',value:{}}
			,hideAtAll:{type:'checkbox',value:true,caption:'скрывать посты совсем'}
			,moderation:{type:'checkbox',value:false,caption:'модерация от d3search'}
//			,postByAuthor:{type:'text'}
//			,commentByAuthor:{type:'text'}
			},
			
	run: function()
	{
		if(Math.random()<0.05)
		{
			var rubicon=Number(new Date())-5184000000;
			for(var i in this.config.ignored)
				if(this.config.ignored[i]<rubicon)
					this.config.ignored[i]=undefined;
		}
		
		with(d3.content) if(comments.length==0 && posts.length>0) // Main page
			for(var i=0;i<posts.length;++i) // process every post
				this.processPost(posts[i]);
		
		if(this.config.moderation.value)
		{
		    var moderation = document.createElement('script');
		    moderation.setAttribute('type', 'text/javascript');
		    moderation.setAttribute('src', 'http://api.d3search.ru/moderation/list?t=' + new Date().getTime());
		    document.getElementsByTagName('head')[0].appendChild(moderation);
		}
	},
	
	processPost: function(post)
	{
		var footer=post.getFooter();
		var me=this;
		var id=''+post.id;
	
		if(this.config.ignored.value[id]!=undefined)
			(this.config.hideAtAll.value  ? post.container : $j('div.dt',post.container)).hide();
		
		footer.append('&nbsp; <a class="ignorator" href="#" style="font-weight: bold">[игнорировать]</a>');
		$j('.ignorator',footer).click(function(){return me.processClick(post);});
	},
	
	processClick: function(post)
	{
		var content=$j('div.dt',post.container);
		var id=''+post.id;

		with(this.config.ignored)
		{
			if(value[id]!=undefined)
			{
				value[id]=undefined;
				content.show();
			}else
			{
				value[id]=Number(new Date());
				content.hide();
			}
			_control.update();
		}
		d3.config.save();
		return false;
	}
});
