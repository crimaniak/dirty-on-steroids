// стили от crea7or'a
d3.addModule(
{
	type: "Стилизация",
	name: 'Рестайлинг сайта от dirty tort',
	author: 'crea7or',
	variant: ['dirty.ru'],
	config: {
		active:{type:'checkbox',value:1}
		,postInfoMove:{type:'checkbox',caption:'Информация о посте внизу',value:1}
	},

	run: function()
	{
		var	css = '.post_body {margin-top: 1px;} .post h3 {font-family: tahoma;} .vote_result {font-weight: normal !important;} div.post_comments_page { padding-top: 10px;} .comments_header { margin-bottom: 12px; } .post .dd	{	font-size: 10px !important;	} div.c_footer	{		font-size: 10px !important;	}	div.comment	{	margin-bottom: 0px !important;	padding-bottom: 10px !important;}';
		css += '.b-comments_controls_social {display: inline; padding: 5px 0px 0px 5px;} .b-comments_controls_sort{display: inline;}'
		+ 'div.b-comments_controls { padding: 14px 0px 10px 5px; min-width: 800px;}';

		if (( d3.page.postComments ||  d3.page.inboxComments ) && document.location.href.indexOf('write') == -1 )
		{
//			css += ' .b-ads { width: 0px; display: hidden;}';
			if ( this.config.postInfoMove.value )
			{
				var postInfo = document.querySelector('div.dd');
				var postParent = postInfo.parentNode;
				postParent.removeChild( postInfo );
				postParent.appendChild( postInfo );
                // as some posts gets broke - too wide title and too narrow image+text in right column
                $j('.post .dt .post_body').css({overflow: "visible"});
			}
		}

		style = document.createElement('style');
		style.type = 'text/css';
		if(style.styleSheet)
		{
			style.styleSheet.cssText = css;
		}
		else
		{
	    	style.appendChild(document.createTextNode(css));
		}
		$j('head').append(style);

		var socBut = document.querySelector('span.b-comments_controls_social');
		var socButTarget = document.querySelector('div.b-comments_controls_new_nav');
		if ( socBut && socButTarget)
		{
			var socParent = socBut.parentNode;
			socParent.removeChild( socBut );
			socButTarget.appendChild( socBut );
		}
	}
});
