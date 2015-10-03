// Hides posts with low rating
d3.addModule(
	{
		type: "Содержание",
		name: 'Прятать посты с низким рейтингом',
		author: 'Aivean',
		variant: ['dirty.ru'],
		config: {
			active: {type: 'checkbox', value: 0},
			rating: {
				type: 'select', value: 0,
				options: {'100': 100, '40': 40, '10': 10, '5': 5, '0': 0, '-5': -5, '-10': -10},
				caption: 'Рейтинг меньше, чем:'
			}
		},

		onPost: function (post) {
			if (d3.page.my) return;
			if (post.ratingValue() < this.config.rating.value && !d3.page.postComments && !d3.page.inbox) {
				post.container.hide();
			}
		}
	});