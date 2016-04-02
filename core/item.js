var Item=function(o){for(var i in o) this[i]=o[i];};
Item.prototype=
{
	offset: function(){return this.container.offset();},
	height: function(){return this.container.height();},
	getContent: function(){return $j(this.contentClass,this.container);},
	getBody: function(){return $j(this.bodyClass, this.container);},
	getContentText: function(){return this.getContent().text();},
	ratingContainer: function(){return $j('.vote_result',this.container);},
	ratingValue: function(){
        var container_temp = this.ratingContainer();
        if (container_temp.hasClass("vote_result__disabled")) {
            return null;
        } else {
            return parseInt(container_temp.text(),10);
        }
    },
	getFooter: function(){return $j(this.footerClass,this.container);}
};

