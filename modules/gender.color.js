// Половой вопрос
d3.addModule(
{
	type: "Социализм",
	name: 'Цветовая дифференциация полов',
	author: 'crea7or',
	config: {active:{type:'checkbox',value:1}},
	
	onPost: function(post){
		this.processElements(post.info.get(0).querySelectorAll('a.c_user'));
	},

	onComment: function(comment){
		this.processElementsComment(comment.getFooter().get(0).querySelectorAll('a.c_user'));
	},

	//expecting array of a.c_user DOM elements
	processElements: function(elemArray){
		if(!elemArray)return;
		for(var i = 0; i < elemArray.length; i++)
		{
			if (elemArray[i].previousSibling.nodeValue.indexOf('Написала') > -1 )
			{
				//female
				elemArray[i].style.borderBottom = '1px solid #ff78f7';
			}
			else
			{
				//male
				elemArray[i].style.borderBottom = '1px solid #5086ff';
			}
			elemArray[i].style.textDecoration = 'none';
		}
	},
	//expecting array of a.c_user DOM elements for comments
	processElementsComment: function(elemArray){
		if(!elemArray)return;
		for(var i = 0; i < elemArray.length; i++)
		{
			iconAnchor = elemArray[i].parentNode.querySelector('a.c_icon');
			if ( iconAnchor )
			{
				var nextNode = iconAnchor.nextSibling;
				while( nextNode )
				{
					if ( nextNode.nodeName == 'SPAN' )
					{
						if ( nextNode.innerHTML.indexOf('Написала') > -1 )
						{
							//female
							elemArray[i].style.borderBottom = '1px solid #ff78f7';
						}
						else
						{
							//male
							elemArray[i].style.borderBottom = '1px solid #5086ff';
						}
						elemArray[i].style.textDecoration = 'none';
						break;
					}
					nextNode = nextNode.nextSibling;
				}
			}
		}
	},	
});
	
