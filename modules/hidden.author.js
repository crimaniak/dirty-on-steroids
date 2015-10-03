// Hidden authors
d3.addModule(
{
	type: "Социализм",
	name: 'Анонимные авторы постов',
	author: 'crimaniak',
	variant: ['dirty.ru'],
	config: {active:  {type:'checkbox',value:0,caption:"Анонимность", description: 'Модуль для анонимизации авторов постов и комментов'}
			,posts:   {type:'checkbox',value:0,caption:"Анонимные авторы постов", description: 'Скрывать авторов постов'}
			,comments:{type:'checkbox',value:0,caption:"Анонимные комментаторы", description: 'Скрывать авторов комментариев'}
			,mark:	  {type:'text',value:'?????',caption:"Менять никнеймы на:", description: 'Что именно писать вместо скрытых имён'}
			},

	onPost: function(post){
		// anonymize posts
		if(this.config.posts.value) {
			$j('.dd a[href^="/user/"]', post.container).html(this.config.mark.value);
		}
	},

	onComment: function(comment) {
		var mark=this.config.mark.value;
		// anonymize comments
		if(this.config.comments.value) {
			// footers
			$j('.c_footer a[href*="/user/"]', comment.container).html(mark);
			// bodies
			d3.xpath.each("//div[contains(@class,'c_body')]//text()", //text()[matches(string(),'[^ ]+:[\\s\\S]*')]",
				function(node)
				{
					if(node.data != undefined ///< opera fix
						&& node.parentNode.className.split(/\s/).indexOf("c_body") >= 0) //TODO maybe this can be replaced by XPATH
						node.data=node.data.replace(/^[^ ]+:/,mark+':');
				}, comment.container.get(0));
		}
	},

	run: function()
	{
		if (this.config.comments.value) {
			var mark = this.config.mark.value;
			var searchMask = new RegExp(RegExp.escape(mark) + ': ', 'g');
			with (d3.window.commentsHandler) {
				var old = toggleCommentForm;
				toggleCommentForm = function (button, postId, commentId) {
					old(button, postId, commentId);
					var $textarea = $j('.b-comments_reply_block textarea');
					// remove ?????: from answer form
					$textarea.each(function() {
						this.value = this.value.replace(searchMask, '');
					});

					// add username back to answer form before submit
					var $yarr = $j("input.b-comments_reply_block_yarrr");
					$yarr.on("click.hidden.author", function($button, $textarea){
						return function(){
							var $user = $j("a.c_user", $textarea.parents("div.comment"));
							if ($user.length) {
								var href = $user.attr("href");
								var userName = href.substr(href.lastIndexOf('/') + 1);
								$textarea.each(function () {
									this.value = userName + ": " + this.value;
								});
							}
							$button.off("click.hidden.author");
						}
					} ($yarr, $textarea));
				};
			}
		}
	}
});