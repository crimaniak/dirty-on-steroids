(function(){

	var processor;

d3.addModule(
{
	type: "Стилизация",
	name: 'Х-фаг',
	author: 'crimaniak',
	variant: ['dirty.ru'],
	config: {
		active:{type:'checkbox', value:0,description:'Ищет и уничтожает подозрительные теги и атрибуты в текстах постов и комментариев по заданным маскам'},
		masks:{type:'text',value:'.//*[@class="b-bg_animation" or @style]',caption:'Маски','description':'Набор XPath масок, по которым будут выявлены подозрительние ноды. В качестве корневого узла указывается контейнер поста или комментария, поэтому используйте ось descendant::, чтобы проверять только тело элемента. Например, .//b для выявления всех тегов <b> внутри постов. Чтобы задать несколько масок, разделяйте их оператором " || " (пробелы слева и справа обязательны).'},
		action:{type:'select',value:'show',options:{'Показать':'show','Удалить':'del'},caption:'Что делать', description: 'После нахождения подозрительного тега можно его подсветить, убрав исходный стиль, или вообще удалить. Последняя опция на случай, если удаление атрибутов по какой-то причине не помогает.'},
		newStyle:{type:'text',value:'border: 1px red dashed',caption:'Поставить стиль',description: 'К найденным фрагментам будет применен этот стиль'},
		toDelete:{type:'text',value:'style class basefont font bgcolor border width height hspace vspace background nowrap',caption:'Атрибуты к удалению',description: 'Какие именно атрибуты удалять у найденных по маскам фрагментов'}
		},
	masks: [],
		
	run: function()
	{
		this.masks = this.config.masks.value.split(/\s+\|\|\s+/);
		var newStyle = this.config.newStyle.value;
		var attrToDel = this.config.toDelete.value.split(/\s+/);
		processor 
			= this.config.action.value == 'show'
			? function(item, mask)
				{
					var title = 'Найдено по маске: '+mask;
					$j.each(attrToDel, function(index, attr){
						if(item.hasAttribute(attr))
						{
							title += '\n\n'+attr+': '+item.getAttribute(attr);
							item.removeAttribute(attr);
						}
					});
					item.setAttribute('title',title);
					item.setAttribute('style', newStyle);
				}
			: function(item, mask){item.parentNode.removeChild(item);};
	},

	onPost: function(post)
	{
		this.processItem(post);
	},

	onComment: function(comment) 
	{
		this.processItem(comment);
	},
	
	processItem: function(item) 
	{
		var container = item.getBody().get(0);
		if(container !== undefined) $j.each(this.masks, function(index, mask)
		{
			d3.xpath.each(mask, function(item, i){
				if(!item.hasAttribute('data-x-phage'))
				{
					processor(item, mask);
					item.setAttribute('data-x-phage', '1');
				}
			}, container);
		});
	}
	
});

	
})();

