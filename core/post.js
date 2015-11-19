
var Post=function(container)
{
	this.container=container;
	this.container.get(0).post=this;

	this.id = parseInt(container.attr('id').substr(1), 10);
	this.info=$j('.dd',this.container);
	this.userName = $j('a[href*="/user/"]',this.info).text();
	this.userId=parseInt($j("a.c_user", this.container).attr("data-user_id") ,10);
	this.isNew = $j('a[href*="#new"]',this.info).length || $j(".b-all_new_comments_link" ,this.info).length;
	this.isMine = this.userName==d3.user.name;
};

Post.prototype=new Item
({
	contentClass: '.dt',
	bodyClass: 'div.dt div.dti div.post_body',
	footerClass: '.dd',
	getClass: function(){return 'post';},
	_idMask: /(\d+)\/?(#.*)?$/,
	
	switchBody: function()
	{
		with(this.container.style) if(display=='') display='none'; else display='';
		return false;
	},
    commentsCount: function(){return parseInt(this.container.find(".b-post_comments_links a:first").text(), 10);}
});

d3.Post=Post;
