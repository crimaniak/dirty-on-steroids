// Hides posts with low rating
d3.addModule(
    {
        type: "Содержание",
        name: 'Прятать посты с низким рейтингом',
        author: 'Aivean',
        config: {
            active: {type: 'checkbox', value: false},
            rating: {
                type: 'select', value: 0,
                options: {'10': 10, '5': 5, '0': 0, '-5': -5, '-10': -10},
                caption: 'Рейтинг меньше, чем:'
            }
        },
        run: function () {
            var posts = d3.content.posts;
            for (var i in posts) {
                var p = posts[i];
                if (p.ratingValue() < this.config.rating.value) {
                    p.container.hide();
                }
            }
        }
    });