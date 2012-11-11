// Половой вопрос
d3.addModule(
{
	type: "Прочее",
	name: 'Показываться онлайн через d3search',
	author: 'crea7or, Stasik0',
	config: {active:{type:'checkbox',value:true}},

	run: function()
	{
	  	var time1 = new Date();

		var vUserName = d3.user.name;
		if( vUserName != null || vUserName.length > 0 )
		{
			var lastCheckinTimestamp = d3.localStorGetItem('lastCheckinTimestamp', 0 );
			var drawStuff = function()
			{
				var divContentLeft = document.querySelector("div.content_left");
				if ( divContentLeft )
				{
					var checkinsMarkup = localStorage.getItem('checkinsMarkup');
					var newdiv = document.createElement('div');
					newdiv.innerHTML =  checkinsMarkup;
					divContentLeft.appendChild( newdiv );
					var module = d3.getModule("Dirty tooltip");
					if(module != null){
						module.processLinks.call(module, divContentLeft);
					}
				}
				var highlightsStyles = localStorage.getItem('checkinsHighlights');
				if (highlightsStyles != null)
				{
					var highlightsDiv = document.createElement('div');
					highlightsDiv.innerHTML = highlightsStyles;
					document.body.appendChild(highlightsDiv);
				}
			};
			var now = new Date().getTime();
			if ((now - lastCheckinTimestamp) > 1000 * 60 * 2 )
			{
				$j(document).ready(function(){
					var checkinScript = document.createElement("script");
					checkinScript.setAttribute("src", "http://api.d3search.ru/checkin/" + vUserName );
					document.body.appendChild(checkinScript);
					localStorage.setItem('lastCheckinTimestamp', now);
					checkinScript.load(drawStuff);
				});
			}else{
				drawStuff();
			}
		}
	}
});
	
