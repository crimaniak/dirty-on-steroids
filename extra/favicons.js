// Favicons
d3.addModule(
{
	type: "Прочее",
	name: 'Показывать favicons доменов',
	author: 'Stasik0, NickJr, crimaniak',
	config: {
		active:{type:'checkbox',value:true},
		mouseover:{type:'radio',caption:'Показывать иконки',options:{"перед ссылками":"false","при наведении":"true"},value:"false"},
		domainWhitelist:{type: 'text', caption:'Список доменов', value:'dirty.ru,d3.ru,d3search.ru,livejournal.com,lenta.ru,flickr.com,google.com,google.ru,yandex.ru,yandex.net,rian.ru,wikipedia.org,wikimedia.org,futurico.ru,leprosorium.ru,lepra.ru,facebook.com,twitter.com,gazeta.ru,vedomosti.ru,1tv.ru,fontanka.ru,kommersant.ru,vesti.ru,kp.ru,blogspot.com,narod.ru,vimeo.com,rbc.ru,korrespondent.net,youtube.com'
		},
	},
	
	faviconService: 'http://favicon.yandex.net/favicon/',

	getDomainMasks: function()
	{
		return this.config.domainWhitelist.value
			.split(/[\s,]+/)
			.map(function(item){
				return new RegExp('^(.*\.)?'+item.replace(/\./g,'\\.').replace(/\*/g,'.*')+'$','i');
			});
	},
	
	hideFavicon: function(e){
		$j(e.target).css('background-image', 'none');
	},

	showFavicon: function(e, faviconUrl){
		$j(e.target).css({'padding-top':'16px', 'background-image':'url('+faviconUrl+')', 'background-repeat':'no-repeat'});
	},
	
	inWhiteList: function(domain){
		if(domain.length==0) return false;
		if(this.config.domainWhitelist.value === "*") return true;
		if(this.inWhiteList.masks == undefined) this.inWhiteList.masks = this.getDomainMasks();
		try
		{
			this.inWhiteList.masks.forEach(function(mask){
				if(mask.test(domain)) {	throw true;	}
			});
			return false;
		} catch(e)
		{
			return true;
		}
	},

	run: function(){
		if(d3.page.user) return;
		var me=this;
		//iterate over links
		$j.each($j('div.dt > a, div.c_body > a, div.dt > div.post_video > div > a'), function(index, link){
			var faviconUrl = me.faviconService+link.hostname;
			if(me.inWhiteList(link.hostname))
			{
				if(me.config.mouseover.value == 'true'){
					$j(link)
						.mouseover(function(e){me.showFavicon(e, faviconUrl);})
						.mouseout(me.hideFavicon);
				}else{
					$j(link).css({'padding-left':'19px', 'background-repeat':'no-repeat', 'background-image':'url('+faviconUrl+')'});
				}
			}
		});
	}
});
