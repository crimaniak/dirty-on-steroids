// Спрятать рейтинг постов
d3.addModule(
	{
		type: "Социализм",
		name: 'Выделение пользователей',
		author: 'Aivean',
		newUsers: 0,
		oldUsers: 0,
		variant: ['dirty.ru','leprosorium.ru'],
		config: {
			active: {type: 'checkbox', value: 0},
			oldskool: {type: 'checkbox', caption: 'Показывать олдскульность поста', value: 0},
			style:{type:'radio', caption:'Стиль:', options:{"Звездочка":0, "ID целиком":1,"ID целиком через |":2}, value:0},
			idThreshold: {type: 'text', caption: 'Выделять ID пользователя больше ', value: '37194'}
			},

		run: function() {
			this.idParsed = parseInt(this.config.idThreshold.value);
			this.styleInt = parseInt(this.config.style.value);
		},

		mark: function(user, userId) {
			switch(this.styleInt) {
				case 0 : user.after(" <sup>*</sup>"); break;
				case 1 : user.after(" <sup>" + userId + "</sup>"); break;
				case 2 :  user.after(" <span style='padding-left:0.5em;'> | " + userId + "</span>"); break;
			}
		},

		processElement:function(userId, footer) {
			if (userId > this.idParsed) {
				this.mark($j("a.c_user", footer), userId);
				this.newUsers++;
			}
			else
			{
				this.oldUsers++;
			}
		},

		onComment: function (comment) {
			this.processElement(comment.userId, comment.getFooter());
		},

		onPost: function (post) {
			this.processElement(post.userId, post.getFooter());
		},

		onCommentsUpdated: function ( comment ) {
			if ( this.config.oldskool.value == 1)
			{
				var headerInner = document.querySelector('div.b-comments_controls_new_nav');
				if ( headerInner )
				{
					var oldskval = Number(( 100 / ( this.newUsers + this.oldUsers )) * this.oldUsers).toFixed(2);
					var newSpan = document.createElement('div');
					newSpan.setAttribute('style', 'padding: 0px 7px 0px 7px;');
					newSpan.setAttribute('class', 'b-comments_controls_sort');
					newSpan.appendChild(document.createTextNode('oldsk: ' + oldskval+' '));
					headerInner.appendChild( newSpan );
				}
			}
		}
	});
