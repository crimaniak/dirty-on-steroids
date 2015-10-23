d3.addModule(
{
	type: "Содержание",
	name: 'Порог комментариев',
	author: 'bearoff',
	config: {active:{type:'checkbox',value:true, description:'Добавляет выпадающий список, который позволяет скрывать комментарии с низким рейтингом. Рейтинги в списке хитро рассчитываются для каждого поста индивидуально.'}
            ,beFast:{type:'checkbox',value:false,caption:'Работать очень быстро (кнопка "новые" не будет работать)', description:'Самая важная опция. Быстрый способ работает на порядок быстрее, чем медленный. Это становится заметно в постах от сотни комментариев. Однако быстрый способ ломает кнопки _все комментарии_/_новые_. Если для вас это не критично — смело используйте эту опцию.'}
            ,optionsCount:{type:'text',value:'6',caption:'Количество опций: ',description:'Cколько опций будет в ниспадающем меню. Когда комментариев в посте мало, опций может быть меньше, чем это значение.'}
            ,defaultOption:{type:'text',value:'0',caption:'Опция по умолчанию: ', description:'Какая опция применится сразу после того, как вы откроете пост.'}
            ,saveSelectedOption:{type:'checkbox',value :true,caption:'Использовать опцию, выбранную на странице, вместо умолчания', description:'Если поставить тут галочку, то вместо опции по умолчанию будет использоваться та опция, которую вы последний раз выбрали в ниспадающем меню.'}
            ,minCommentsCount:{type:'text',value:'5',caption:'Минимум комментариев для работы: ', description:'Если в посте будет меньше комментариев, чем значение этого параметра, трешхолд не появится на странице.'}
            ,alwaysShowRepliesToMe:{type:'checkbox',value :true,caption:'Не скрывать ответы мне', description:'Всегда показывать ответы на ваши комментарии. Ваши комментарии показываются всегда.'}
			},
    threshold: 0,
    variant: ['dirty.ru','leprosorium.ru'],
    select:null,
    min_rating:0,
    max_rating:0,
    selected_index:0,
    select_properties:{thresholds:[], selected_strings:[],counts:[]},
    sorted_comments:{},
    always_visible_count:0,
    my_comments:{},
        run: function()
        {
            if (!d3.page.postComments
                || !d3.content.comments.length
                || d3.content.comments.length < parseInt(this.config.minCommentsCount.value))
            {
                return false;
            }

            if (this.config.saveSelectedOption.value) {
                this.selected_index = d3.storage.get('commentsSelectedThreshold'); // todo ask about how to use hidden options
                if (!this.selected_index) {
                    this.selected_index = 0;
                }
            } else {
                this.selected_index = parseInt(this.config.defaultOption.value);
                if (this.selected_index < 0) {
                    this.selected_index = 0;
                }
            }

            this.getStats();
            this.prepareThresholds();
            this.updateVisibility(false);
            this.displaySelect();
        },

        displaySelect: function()
        {
            var me = this;
            if (d3.content.variant == "dirty.ru") {
                var header_div = $j("div.b-comments_controls_new_nav");
            } else {
                var header_div = $j("div.b-comments_controls");
            }
            var select_div = $j('<div id="advansed_treshhold_div" style="display:inline;margin-left:5px;margin-right:5px;"></div>');
            this.select  = $j('<select id="advansed_treshhold" style="width:180px;"></select>');
            select_div.append(this.select);
            header_div.append(select_div);

            for (var i=0; i<this.select_properties.thresholds.length;i++) {
                var visible_count = this.always_visible_count + this.select_properties.counts[i];
                var option_title = i+': Больше ' + this.select_properties.thresholds[i] + " (" + visible_count + ")";
                var option = $j('<option id="advthresh_'+i
                                    + '" value="'+this.select_properties.thresholds[i]
                                    + '" '+this.select_properties.selected_strings[i]+'>'
                                    + option_title
                                    + '</option>');
                this.select.append(option);
            }

            this.select.change(function(e){
                me.onThresholdChange();
                });
        },

        fixParentLink: function(parentLink, parent) {
            parentLink.click(function(){
                parent.show();
            });
        },
        
        getStats: function()
        {
            for (var i=0; i<d3.content.comments.length; i++) {
                var rating = parseInt(d3.content.comments[i].ratingValue());
                if (isNaN(rating)) {
                    // this comment seems to be deleted
                    continue;
                }
                if (this.sorted_comments[rating]===undefined) {
                    this.sorted_comments[rating] = [];
                }
                this.sorted_comments[rating].push(i);

                if (this.min_rating > rating) {
                    this.min_rating = rating;
                }
                if (this.max_rating < rating) {
                    this.max_rating = rating;
                }
                if (d3.content.comments[i].parentId!==undefined) {
                    var parent = $j("#"+d3.content.comments[i].parentId);
                    this.fixParentLink($j(".c_parent", d3.content.comments[i].container), parent);
                }
            }
        },
        
        prepareThresholds: function()
        {
            var comments_count = d3.content.comments.length;
            var rest_count = comments_count;
            var options_left = this.config.optionsCount.value;
            var curr_step = Math.floor(comments_count/options_left);

            var curr_i = -1;
            var curr_thresh_count = 0;
            var curr_thresh_value = null;

            for (var i=this.min_rating; i<=this.max_rating; i++) {
                if (this.sorted_comments[i]===undefined) {
                    continue;
                }
                if (curr_thresh_value===null) {
                    curr_thresh_value = i;
                }

                curr_thresh_count += this.sorted_comments[i].length;
                if (curr_thresh_count >= curr_step) {
                    curr_i++;
                    this.select_properties.counts[curr_i] = rest_count;
                    this.select_properties.thresholds[curr_i] = curr_thresh_value;
                    this.select_properties.selected_strings[curr_i] = '';
                    rest_count = rest_count-curr_thresh_count;
                    curr_thresh_count=0;
                    curr_thresh_value=null;
                    options_left--;
                    if (!options_left) {
                        break;
                    }
                    curr_step = Math.floor(rest_count/options_left);
                }
            }

            if (this.selected_index > curr_i) {
                // less options than selected
                this.selected_index = curr_i;
            }

            this.select_properties.selected_strings[this.selected_index] = 'selected';
            this.threshold = this.select_properties.thresholds[this.selected_index];
        },
        
        updateCounts: function(rating_value, visible)
        {
            for (var i=0; i<this.select_properties.thresholds.length;i++) {
                if (visible || rating_value >= this.select_properties.thresholds[i]) {
                    this.select_properties.counts[i]++;
                } else {
                    return;
                }
            }
        },
        
        isReplyToMe: function(comment){
            return comment.parentId && this.my_comments[comment.parentId];
        },
        
        isVisible: function(comment)
        {
            if (comment.isMine) {
                this.always_visible_count++;
                this.my_comments[comment.id] = comment.id;
                return true;
            }
            if (this.config.alwaysShowRepliesToMe.value && this.isReplyToMe(comment)) {
                this.always_visible_count++;
                return true;
            }
            if (comment.ratingValue() >= this.threshold) {
                return true;
            }
            return false;
        },
        
        updateVisibility: function(first)
        {
            var show = this.config.beFast.value ? function(item){item.css('display','block');} : function(item){item.show();};
            var hide = this.config.beFast.value ? function(item){item.css('display','none');}  : function(item){item.hide();};
            
            for (var i=0; i<d3.content.comments.length; i++) {
            	var comment = d3.content.comments[i];
                var isVisible = this.isVisible(comment);
                
                (isVisible ? show : hide)(comment.container);
                
                if (first) {
                    this.updateCounts(comment.ratingValue(), isVisible);
                }
            }
        },

        onThresholdChange: function()
        {
            this.selected_index = this.select.find(':selected').attr('id').split('_')[1];
            if (this.config.saveSelectedOption.value) {
                d3.storage.set('commentsSelectedThreshold', this.selected_index);
            }

            this.threshold = this.select.val();
            this.updateVisibility(false);
        }
});
