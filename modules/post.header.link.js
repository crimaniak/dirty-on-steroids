// Предпросмотр внешних ссылок в заголовках постов
d3.addModule(
{
	type: "Содержание",
	name: 'Показывать внешние ссылки из заголовков постов',
	author: 'crea7or',
	variant: ['dirty.ru'],
	config: {active:{type:'checkbox',value:1}
			,headerToComments:{type:'checkbox',caption:'Ссылка заголовка на комментарии',value:0}
	},

	onPost: function (post) {
		var headersArr = $j("h3", post.container).get();
		if (headersArr) 
		{
			var headerLinks;
			var linkHref;
			var linkPreview;
			for (var i = 0; i < headersArr.length; i++) 
			{
				headerLinks = headersArr[i].getElementsByTagName('a');
				if (headerLinks.length == 1) 
				{
					var d3link = true;
					if ( headerLinks[0].href.indexOf('dirty.ru/comments/') == -1 ) 
					{
						d3link = false;
					}
					else
					{
						var linkSplit = headerLinks[0].href.split("/");
						if ( linkSplit.length > 2 )
						{
							if ( post.id != linkSplit[linkSplit.length - 2] )
							{
								d3link = false;
							}
						}
					}
					
					if ( d3link == false ) 
					{
						linkHref = headerLinks[0].hostname.replace(/^www\./, '');
						linkPreview = document.createElement('a');
						linkPreview.href = headerLinks[0].href;
						linkPreview.innerHTML = linkHref;
						linkPreview.setAttribute('style', 'margin-left: 20px; opacity: 0.5;');
						headersArr[i].appendChild(linkPreview);
						if ( this.config.headerToComments.value == 1)
						{
							var linkToPost = "";
							var postInfo = headersArr[0].parentNode.parentNode.querySelector('div.dd');
							if ( postInfo )
							{
								var linksInInfo = postInfo.getElementsByTagName('a');
								if ( linksInInfo )
								{
									for ( var c = 0; c < linksInInfo.length; c++)
									{										
										if ( linksInInfo[c].href.indexOf("dirty.ru/comments/") > -1 )
										{
											linkToPost = linksInInfo[c].href;
											break;
										}
									}
								}
							}
							if ( linkToPost.length > 0 )
							{
								headerLinks[0].href = linkToPost;
							}
						}
					}
				}
			}
		}
	}
});
	
