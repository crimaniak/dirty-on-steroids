
// Hide unwanted elements module
d3.addModule(
{
	type: "Стилизация",
	author: 'crimaniak',
	name: 'Спрятать лишнее',
	variant: ['dirty.ru'],
	config: 
		{active:{type:'checkbox', value:1}
		,hideSocialLinks:{type:'checkbox', caption:'Спрятать кнопки социальных сетей', value:0}
		},
	run: function()
	{
		if(this.config.hideSocialLinks.value) $j('.b-post_social_link').hide();
	}
});