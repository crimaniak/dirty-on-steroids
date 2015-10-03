// Кнопка пересоздания инбокса
d3.addModule(
{
	type: "Содержание",
	name: 'Добавлять кнопку пересоздания инбокса',
	author: 'crea7or',
	config: {active:{type:'checkbox',value:1}},
	
	run: function()
	{
		var me = this;
		var tortAddLinksInbox = document.querySelector('div.b-inbox_controls');
		if ( tortAddLinksInbox )
		{
			tortNewd = document.createElement('div');
			tortNewa = document.createElement('a');
			tortNewa.href = '#';
			tortNewd.setAttribute('style', 'margin-top: 10px;');
			tortNewa.setAttribute('class', 'b-inbox_controls_delete_inbox');
			tortNewa.innerHTML = 'Пересоздать инбокс';
			tortNewd.appendChild( tortNewa );
			tortAddLinksInbox.appendChild( tortNewd );
			$j(tortNewa).bind('click', function(e) { me.copyAction(); });
		}

		if ( document.location.href.indexOf('dirty.ru/my/inbox/write/') > -1 )
		{
			// do not change localstorage to d3.storage
			var timeOfUsersCopy = localStorage.getItem('dirtySpmRecInbTime');
			if ( timeOfUsersCopy )
			{
				if (( new Date().getTime() - timeOfUsersCopy ) < 1000 * 30 ) // 10 sec
				{
					var inbUsers = document.getElementById('js-new_inbox_to');
					if ( inbUsers )
					{
						// do not change localstorage to d3.storage
						inbUsers.value = localStorage.getItem('dirtySpmRecInbUsers');
					}
					var inbText = document.getElementById('js-new_inbox_body');
					if ( inbText )
					{
						// do not change localstorage to d3.storage
						inbText.value = localStorage.getItem('dirtySpmRecTxt');
					}
				}
				// do not change localstorage to d3.storage
				localStorage.removeItem('dirtySpmRecInbTime');
				localStorage.removeItem('dirtySpmRecInbUsers');
				localStorage.removeItem('dirtySpmRecTxt');
			}
		}
	},

	copyAction: function(e)
	{		
		var inboxUsers = document.getElementById('js-inbox_controls_users');
		if ( inboxUsers )
		{
			var linksToUsers = inboxUsers.getElementsByTagName('a');
			var userNames = new Array();
			if ( linksToUsers )
			{
				for ( var i = 0; i < linksToUsers.length; i++)
				{
					if ( linksToUsers[i].textContent.length > 0 )
					{
						userNames.push( linksToUsers[i].textContent );
					}
				}
			}
			if ( userNames.length > 0 )
			{
				var postTxtDiv = document.querySelector('div.post_body');
				if ( postTxtDiv)
				{
					// do not change localstorage to d3.storage
					localStorage.setItem('dirtySpmRecTxt', postTxtDiv.innerHTML);
				}
				// do not change localstorage to d3.storage
				localStorage.setItem('dirtySpmRecInbUsers', userNames.join());
				localStorage.setItem('dirtySpmRecInbTime', new Date().getTime());
				document.location.href = location.protocol + '//dirty.ru/my/inbox/write/';
			}
		}
		e.preventDefault();
		return false;
	},
});
