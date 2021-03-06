// Hides posts with low rating
d3.addModule(
	{
		type: "Содержание",
		name: 'Бесконечная страница',
		author: 'Aivean',
		config: {
			active: {type: 'checkbox', value: 1}
		},

		eventName: "scroll.infinite.paging",

		lastCheckTime : new Date().getTime(),

		getLoadMoreButton : function () {
			return $j("a#js-index_load_more_posts");
		},

		needToCheck : function(){
			if ((new Date()).getTime() - this.lastCheckTime > 20) {
				this.lastCheckTime = new Date().getTime();
				return true;
			}
			return false;
		},

		enableScroll: function (me, loadMoreButton) {
			if (console) console.log("Infinite paging is active.");
			var $doc = $j(document);
			var $body = $j("body");
			var $footer = $j("#js-footer");
			if (!$doc.length || !$body.length || !$footer.length) {
				if (console) console.log("One of this elements is undefined: ", $doc, $body, $footer);
				return;
			}

			$j(window).on(me.eventName, function(){
				if (!me.needToCheck()) return;
				if (loadMoreButton.hasClass("js-loading")) return; //in progress
				var right = $doc.height() - $body.height() * 2 - $footer.height();
				var loadContent = $doc.scrollTop() >= right;
				if (loadContent) {
					loadMoreButton = me.getLoadMoreButton();
					if (loadMoreButton.length && !(loadMoreButton.hasClass("hidden"))) {
						//loadMoreButton.click();
						try {
							var scriptToRun = loadMoreButton.attr("onclick");
							scriptToRun = scriptToRun.replace(/return[^;]+;?/g, "");
							scriptToRun = scriptToRun.replace(/\bthis\b/g, "$('js-index_load_more_posts')");
							d3.service.embedScript(scriptToRun);
						} catch (e) {
							if (console) console.log("Infinite page: something went wrong, disabling", e);
							$j(window).off(me.eventName);
						}
					} else {
						$j(window).off(me.eventName);
					}
				}
			});
		},

		run: function(){
			var loadMoreButton = this.getLoadMoreButton();
			if (loadMoreButton.length) {
				this.enableScroll(this, loadMoreButton);
			}
		}
	});