var Item=function(o){for(var i in o) this[i]=o[i];};
Item.prototype=
{
	offset: function(){return this.container.offset();},
	height: function(){return this.container.height();},
	getContent: function(){return $j(this.contentClass,this.container);},
	getContentText: function(){return this.getContent().text();},
	ratingContainer: function(){return $j('.vote_result',this.container);},
	ratingValue: function(){return parseInt(this.ratingContainer().text(),10);}
};
