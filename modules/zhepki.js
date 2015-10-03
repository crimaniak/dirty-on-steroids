// Поддержка жепок
d3.addModule({
	type: "Социализм",
	name: 'Жепки',
	author: 'Aivean',
	variant: ['dirty.ru'],
	config: {active: {type: 'checkbox', value: 1},
		rating: {
			caption: 'Показывать жепки с рейтингом:',
			type: 'select', value: 0,
			options: {"Любым": -32000, "Ноль и больше": -1, "Больше 0": 0, "Больше 5": 5, "Больше 10": 10}
		}
	},

	className: 'zhepka',
	underratedClassName: 'zh-underrated',
	containerClassName: 'zheps-container',

	zheps: [],
	zhepsContainer: null,

	run: function () {
		$j("<style type='text/css'> \n\
				."+this.className+" { \n\
				 	margin: 0 0 4px;\n\
				 	padding: 2px 3px;\n\
				 	background-color: #f8eebe;\n\
					border-bottom: 1px solid #E0E0E0;\n\
					border-right: 1px solid #E0E0E0;\n\
					white-space: nowrap;\n\
				} \n\
				."+this.className+"."+this.underratedClassName+" { \n\
					opacity: 0.5;\n\
					background-color: #f5f5f5;\n\
				} \n\
				."+this.className+" span {\n\
					opacity: 0.2; \n\
				}\n\
				."+this.containerClassName+" {\n\
					margin-top: 0;\n\
					padding: 0;\n\
				}\n\
				.dd ."+this.containerClassName+".b-post_tags a.tag {\n\
				 	background-color: #f8eebe;\n\
				}\n\
			</style>").appendTo('head');
		this.zhepsContainer = $j('<ul class="' + this.containerClassName + ' b-post_tags"></ul>').appendTo("#js-tags_public");
	},

	redrawZheps: function () {
		// sort by rating
		var elements = [];
		for (var el in this.zheps) {
			if (this.zheps[el].text == undefined) continue;
			elements.push(this.zheps[el]);
		}
		elements.sort(function(a,b){return b.rating - a.rating;});
		if (elements.length == 1) { //run once
			this.zhepsContainer.parents(".hidden").removeClass("hidden");
		}
		var me = this;
		this.zhepsContainer.empty();
		elements.forEach(function(zhep) {
			if (!zhep.element) {
				zhep.element = $j('<li><a class="tag" href="#'+zhep.id+'">'+zhep.text+'</a></li>');
			}
			zhep.element.appendTo(me.zhepsContainer);
			me.zhepsContainer.append(" ");
		});
	},

	addZhepka: function (zhepka, rating, commentId) {
		if (!this.zheps[zhepka]) {
			this.zheps[zhepka] = {"text": zhepka, "rating": rating, "id": commentId};
		} else {
			this.zheps[zhepka].rating += rating;
		}
		this.redrawZheps();
	},

	validComment: function(comment) {
		var content = comment.getContentText();
		return content.indexOf("[x]") != -1 ||
			content.indexOf("[X]") != -1 ||
			content.indexOf("[х]") != -1 ||
			content.indexOf("[Х]") != -1;
	},

	onComment: function (comment) {
		if (!this.validComment(comment)) return;
		var underrated = comment.ratingValue() <= this.config.rating.value;
		var html = comment.getContent().html();
		var r = /([^:\s\.><][\wа-яёЁ\-–—\s!%\?,]+?)\s?\[[хx]\]/gi;
			// /(\w[\s\w]*)\[x\]]/ig;
		html = html.replace( /(\&nbsp;)/gi,' ');

		var match;
		var found = [];
		while (match = r.exec(html)) {
			found.push({"text": match[1], "all": match[0]});
		}
		var processed = []; //handle multiple equal zheps in one comment
		if (found.length) {
			var me = this;
			found.forEach(function (f) {
				var r2 = new RegExp(RegExp.escape(f.all));
				html = html.replace(r2, '<span class="' + me.className +
					(underrated ? " " + me.underratedClassName : "") + '">' + f.text + ' <span>[x]</span></span>');
				if (!underrated && !processed[f.text]) {
					me.addZhepka(f.text, comment.ratingValue(), comment.id);
					processed[f.text] = true;
				}
			});
			comment.getContent().html(html);
		}
	}
});