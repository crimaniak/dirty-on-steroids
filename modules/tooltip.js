// Dirty tooltip
d3.addModule(
{
	type: "Прочее",
	name: 'Dirty tooltip',
	author: 'NickJr, Stasik0, and the rest of gang',
	variant: ['d3.ru'],
	config: {
		active:{type:'checkbox',value:1},
		useImages:{type:'checkbox',value:1,caption:'Картинки для tooltip'}
		},

	showing: 0,
	processing: 0,

	run: function(){
		this.processLinks($j(document.body));
	},

	onPost: function(post) {
		this.processLinks(post.container.get(0));
	},

	onComment: function(comment) {
		this.processLinks(comment.container.get(0));
	},

	processLinks: function(elem){
		if(!this.config.active.value)return;
		var me = this;
		var links = $j('a', elem);
		var pattern = /(.*)d3.ru\/user\/(.+)/g;
		for(var i=0; i<links.length; i++){
			var href = links[i].href.toString();
			if(	pattern.test(href) &&
			//but none of theres
			  	href.indexOf('/posts/')<0 && href.indexOf('/comments/')<0 && href.indexOf('/favs/')<0 &&
			//and this is no button
				links[i].className.indexOf("button") < 0
			){
				$j(links[i]).mouseover(
					function(e){
						clearTimeout(me.showing);
						me.showBaloon(e.target);
					}
				)
				.mouseout(
					function(){
					clearTimeout(me.showing);
					me.processing = 0;
					}
				);
			}
		}
	},

	showBaloon: function(obj){
		var dup_div = $j('#dup_div');
		//create div if not jet created
		if(dup_div.length == 0){
			$j(document.body).append('<div id="dup_div" style="position: absolute; z-index: 1300; color: #000;"></div>');
			dup_div = $j('#dup_div');
			$j(document).click(function(){
					$j('#dup_div').css('display', 'none');
				}
			);
		}

		//populate the div
		if(this.config.useImages.value){
			var image1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbwAAAFiCAMAAAC6Wp2yAAACRlBMVEUAAACPj4////8AAAAAAAAAAACPj48AAAAAAABWVlYAAACPj48AAAAAAABra2sAAACPj48AAACBgYEAAAAAAAAAAAAAAABcXFwAAAAdHR0AAAAAAAAAAAAYGBgwMDCPj48AAAAAAAAAAAAAAAAAAAAAAAAAAABnZ2d4eHgAAAAAAAAAAAAuLi4AAAAAAAAAAAANDQ2Pj48ZGRmHh4d8fHyBgYFOTk53d3c2NjaMjIxSUlKPj4+Pj493d3ePj4+NjY2NjY2Pj4+NjY1+fn6Pj4+MjIyBgYF7e3uFhYVycnJ1dXWLi4uOjo52dnaNjY2IiIiPj4+Pj499fX2JiYmPj4+MjIyLi4uPj4+NjY2MjIyLi4uCgoKDg4OPj4+Ojo6IiIiPj4+JiYmKioqGhoaOjo6Hh4ePj4+KioqOjo6Pj4+Pj4+MjIyLi4uPj4+MjIyNjY2Pj4+Ojo6Ojo6Pj4+Pj4+QkJCRkZGSkpKVlZWWlpaZmZmampqcnJydnZ2enp6ioqKnp6erq6utra2urq6vr6+wsLCxsbG0tLS2tra3t7e5ubm6urq9vb2/v7/BwcHCwsLFxcXGxsbHx8fIyMjJycnKysrLy8vQ0NDT09PU1NTW1tbZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+J7SEDAAAAdHRSTlMAAAABAgMDBAUFBgYHCAgJCQoKCwwNDg4PDxAREhISEhMUFRYXGBkZGRobHBwdHh8hISMjJigsLzA0Pz9FT1FSVVpbX2BiZGVnaW5vcHR0eHuBhoqNkJSWmJmanqSlpqeorK6wsrW9vsrMz9DS2N3h8PT6/AElWmUAAAfuSURBVHja7d3bb1TXFcfx31p722Abe8wtFyCAUgpt1BtVhVq1lfqQt770v+1r1MeqUqoqD0kTKqVJoaqqqoZAwTN7rT6cM4wxpoAEp+dY3y/iliCkmY/XPnsfD2PTq3TlS00w1zGtvMof/vmv86sJPkY7rniv9FH57bd/caaUUopoang3L25t/kD2qvNKY8C7OrPda2Zmht7U8NavzXzr/DUv6E0P79bWupedb5VSHL1RVF/+j14745a775X0hYeS525Ck3fl3Z3i5dT5D9ZKNWfTMim878/W3N1nl0ot1cx47iaEd/mMe3E//f6GV3PnqZsQ3s/O75TipWxtXS1e2bJMCu/yae86+34txVysm5PBO3P1reJe3MvZd3aLVWfLMoKjgr3cnv9HsxPuJmWc2L74TQsz47QwwnPekQN17VwxNyll567+uTT3bIzecLWjVs36ArTl4L113t1MSou3z56/U2qEidkbrHIUYr9srv/0yqnN/7UF+eW+dXgp+9U+T+bA5cMHX/5+rlQ5yGcekj68uX1mfdtlz+whTTIzNzc3k6UyIyMjMxm8geCUivv7/7r/x4+UytX0eZW0++F3L83MTWY6Qs+63GSytFRaemZiN5CdMsvpOLd3cvd3/w4pS1ttWG5e//HFNXczOzR4/W/MTObq7ohZqoPLfPJ30xsfvUyP3a1T9fNPMlZ6Vbp+60Jxd3N1PEcunN13pWxJh9pQg6dMRZrZ5WqfNcumXq/qN9+7ULys8J69dWIyU/8t1V34sBvOTpmyNJMuPHzwUVuUpV7duH7Rvbi721GXvH70tPxf3dJp7FYGvuhZSFK+c+Pj+1qU1q2c9dZs091Lf807+nVyvZxJUnaGyb3NoexMykwzU+b27DsfS4v+7la9NDP3J0eBo+UOLqbW/XXcHBsqk9Iyw9MzY3bxk4zIyNKkunvC+4Pcc/AODGN/T8UkMXkD5+Fp5hs7XjMUlpJqOWnWrZnPxTs8gClBN/wEmmfYRlnPVtObSlOt6/1h4MWD9/R/YNkczi1N3R0UK+5rLcy6yevhbLUvefm1mAbablpaLpXcS3NvlpLL+ttiZoCMdsvSndVMZipm5t0n0f3QhoTGqbf6hVldvgDCZbBNiNBkpuVr91zoTWvxPGDlyE13DJ2L3fQufd1GpYhXPk/XELwpB96Epw88Jo/AI/DAI/AIPAIPPAKPwAOPwCPwCDzwCDwCj8ADj8Aj8MAj8Ag8Ag88Ao/AI/DAI/AIPPAIPAKPwAOPwCPwwCPwCDwCDzwCj8Aj8MAj8Ag88Ag8Ao/AA4/AI/AQK92XHwVvgpnZ6itX0tTwtNQDj2segUcvUUpSgDdRu2TyJquX/eCBN8lVM5m8aRYtWTbZbRJ4BB54BB6BR+CBR+AReAQeeAQegQcegUfgEXjgEXgEHngEHoFH4IFH4BF4BB54BB6BBx6BR+AReOAReAQegQcegUfggUfgEXgEHngEHoEHHk8BeAQegQcegUfgEXjgEXgEHngEHoFH4IFH4BF4BB54BB6BBx6BR+AReOAReAQegQcegUfggUfgEXgEHngEHoEHHoFH4BF44BF4BB6BBx6BR+CBR+AReAQeeAQegUfggUfgEXjgEXgEHoEHHoFH4BF44BF4BB54BB6BR+CBR+AReOAReAQegQcegUfgEXjgEXgEHngEHoFH4IFH4BF4BB54BB6BBx6BR+AReOAReAQegQcegUfggUfgEXgEHngEHoEHHoFH4BF44BF4BB6BBx79v8XAm1zFDLyJZiYZeJPlW7KBN0E6ls0p6/Vu4HFUIPDoxWUqpQBvmnipDCZvkkXLZNnkmkfgEXjgEXgEHoEHHoFH4BF44BF4BB54BB6BR+CBR+AReOAReAQegQcegUfg0bN4yRMxgfJIPOwmO3mJ30TmLg8xOXaTWjXz8LKZz11UaVwXuzy8bGYqs/unzuiNdsHsiLT8F83dT1XKzMw0KQ298Y5ex/T05C32e9lM6EZr18Ol5u2AUm2PTmaYJXCjx4vI/E9T9yYsqeZ173F4Zlhwr2XUeJGRmfH4wYGLXv36xrkws/Aws1y9oxyN7HoXGRG5d/fAtrL+4Sf3d8ykdDOTjOVznJvNyBYR3+z9PVMRPd7DT7dPmSRPV/f+t8ze6E7mqciIFnH3i3nmon/rMVX9dnPrXSnT8uA74NKoBk+REdHufnY7WmZGp1fTbr/XLtRMCzPoxrvZjFjc+cdfspvAUEqqyj/d++GNS7NwY/LGO3kZufe327cftkXMW/Sn9SrFV3fuPdo+u7ZjYvTGOXjKe4t/3v/0r9nmbb/FIkJqkhW5l7XND65sbPA8jbdHj7++2yLn0fb35/MWoSY3c7NS1+qar7uvvt7C68vNuo+eOF5Pp3fLVOZQjyuzRezHfDFftMwmeZVSuZCy5po3s9d+VihLvHa88Ep3kckc4nH1J/WYt0WbL5Y3qM3ksmK1VC/F6uu/6HXDfPw+39TvDwa7nZ9aZGuxaIts3SS4SSqmYl6qm5m/9heUdR+fx+9zhf3OfKA7+iFFZsaiRTZ10+7WrwDm5sXl/iYe5OpewTHTG/RxRShaZOTyCtThdeu3my+n7rWunb780DluDfbAcjl9kaEndks8lW55c72JU7ofS7qBH1lKiu4K2/Q0nlSeuHFOH+d9lv7HdvCwooN8NPLa0yfNIw4wNGq0FR6vfphu/wVdBYQ3BOBzEQAAAABJRU5ErkJggg%3D%3D';
			var image2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAFiCAYAAAA6HMKOAAAAj0lEQVRo3u3awRGAIAxEUQXbsDG6oBK6oElJ0AYSZ+I4Hvx7fbOXsEe2OediZVucgF/heiXWbK2piaUUu3nFxpzzG82UUhCdAz3Bu1dhmiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgr/D+PcrtxlHVQ2iiNg4xnij2Xu3sda6e7cVDw8PR7gpYdQwukswp3ACJz05hgtCNpMAAAAASUVORK5CYII%3D';
			dup_div.html('<input type="hidden" id="dup_current_id" value=""><table cellspacing="0" cellpadding="0" border="0"><tr><td width="20" height="35" style="background-image:url('+image1+')"></td><td style="background-image:url('+image2+');background-position:-20px 0"><div style="width:100px;height:35px;background-image:url('+image1+');background-position:-20px 0"></div></td><td width="20" style="background-image:url('+image1+');background-position:right top"></td></tr><tr><td style="background-image:url('+image1+');background-position:0 -35px"></td><td style="background-color:#fff;font-size:10px;padding:0 10px 15px 0;line-height:16px" id="dup_data_td"></td><td style="background-image:url('+image1+');background-position:right -35px"></td></tr><tr><td height="20" style="background-image:url('+image1+');background-position:0 bottom"></td><td style="background-image:url('+image2+');background-position:-20px bottom"></td><td style="background-image:url('+image1+');background-position:right bottom"></td></tr></table>');
		}else{
			dup_div.html('<input type="hidden" id="dup_current_id" value=""><div style="border-right:1px solid #a1a1a1;border-bottom:1px solid #a1a1a1"><div style="background-color:#fff;border:1px solid #505050;font-size:10px;padding:14px;line-height:16px" id="dup_data_td"></div></div>');
		}

		//caching
		if($j("#dup_current_id").val()!=obj.toString()){
			var image3 = 'data:image/gif;base64,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%3D';
			dup_div.css('display', 'none');
			if(this.config.useImages.value){
				$j("#dup_data_td").html('<center><div style="width:150px;height:60px;background-repeat:no-repeat;background-position:center;background-image:url('+image3+')">&nbsp;</div></center>');
			}else{
				 $j("#dup_data_td").html('<center><div style="width:150px;height:60px;line-height:60px">...</div></center>');
			}
			this.processing = 1;
		}

		var dup_pos = $j(obj).offset();
		var dup_leftOffset = (this.config.useImages.value)?35:10;

		dup_div.css('top', (dup_pos.top+obj.offsetHeight+5)+'px');
		dup_div.css('left', (dup_pos.left-dup_leftOffset)+'px');

		var me=this;
		this.showing = setTimeout(function(){
				$j("#dup_div").css('display', 'block');
				me.dup_getData_d3(obj);
		},700);
	},

	extractBetween: function(string, pre, post){
		if(string.indexOf(pre)==-1)return '';
		return (string.split(pre)[1].split(post)[0]);
	},

	//high level wrapper for ajax get supporting XS
	get: function(url, callback){
		if(document.location.host == 'd3.ru'){
			$j.get(url, callback);
		}else{
			var module = d3.getModule("XD");
			if(module != null){
				module.send.call(module, url, '{"service":"bodyHtml"}', callback);
			}
		}
	},	

	dup_getData_d3: function(obj){
		if(this.processing==1){
			var me=this;
			this.get(obj.href, function(data){
				//clear all line breaks and spaces
				var dup_text = data.replace(/(\r\n|\n|\r)/gm,' ').replace(/\s\s+/g,' ');
				//splits are for better performance! :p
				var dup_user_id = me.extractBetween(dup_text, "voteResultsHandler.showVoteResult('" ,"'");
				var dup_user_name = me.extractBetween(dup_text, "class=\"b-user_name-link\">", "</a>");

				var dateSpan = '<span class="js-date';
				var dup_date = "неизвестно";
				if(dup_text.indexOf(dateSpan).length != -1) {
					var timestamp = /data-epoch_date="(\d+)"/.exec(me.extractBetween(dup_text, dateSpan,'</span>'))[1];
					var date = new Date(timestamp*1000);
					var month = ['января','февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
					dup_date = date.getDate()+" "+ month[date.getMonth()]+" "+date.getFullYear();
				}
				
				var dup_karma = me.extractBetween(dup_text, '\'karma\'); return false;">', '<');
				var dup_pluses = me.extractBetween(dup_text, ' right" data-value="', '"');
				var dup_minuses = me.extractBetween(dup_text, ' left" data-value="', '"');

				dup_pluses = (dup_pluses>0)?'<span style="color:green;"><b>+'+dup_pluses+'</b></span>':0;
				dup_minuses = (dup_minuses>0)?'<span style="color:red;"><b>-'+dup_minuses+'</b></span>':0;

				var dup_votes_him = '';
				if(dup_minuses!==0) dup_votes_him += dup_minuses;
				if(dup_minuses!==0&&dup_pluses!==0) dup_votes_him += ' <span style="color:#ccc">/</span> ';
				if(dup_pluses!==0) dup_votes_him += dup_pluses;

				var dup_parent = me.extractBetween(dup_text, ' по приглашению ','.');

				var dup_name = me.extractBetween(dup_text, '<h3 class="b-user_full_name">', '</h3>');

				var dup_country = me.extractBetween(dup_text, '<div class="b-user_residence">', '</div>');

				var dup_sex = (dup_text.indexOf('Она с нами')>-1)?'f':'m';
				var dup_posts = me.extractBetween(dup_text, 'посты <span class="b-menu_item-stat">', '</span>');
				var dup_comments = me.extractBetween(dup_text, 'комментарии <span class="b-menu_item-stat">', '</span>');

				dup_votes_him = (dup_votes_him!='')?'<b>Ваша оценка:</b> '+dup_votes_him:'<span style="color:#999"><b>Ваших оценок нет в '+((dup_sex=='f')?'её':'его')+' карме</b></span>';

				if (!dup_name || /^\s*$/.test(dup_name)) { // empty user name is replaced with login
					dup_name = dup_user_name;
				}
				dup_name = '<span style="font-size:130%;color:'+((dup_sex=='m')?'#009ced':'#ff4fdc')+'"><b>'+dup_name+'</b></span>';

				var dup_subscribers = me.extractBetween(dup_text, '<span class="b-subscribers_count">' ,'</span>');

				if(dup_text.split('<em id="js-usernote" class="b-user_note js-user_note_has_note">').length >= 2){
					var dup_note = me.extractBetween(dup_text, '<em id="js-usernote" class="b-user_note js-user_note_has_note">', '</em>');
					if(dup_note!='Место для заметок о пользователе. Заметки видны только вам.'){

						dup_temp_body_mini = (dup_note.length>32)?dup_note.substring(0,32)+'...':dup_note;

						if(dup_temp_body_mini!=dup_note){
							dup_note = '<b>Ваша заметка:</b><div style="font-size:130%; cursor:help;background-color:#eee;padding:10px;font-family:Times New Roman" title="'+dup_note+'"><i>'+dup_temp_body_mini+'</i></div>';
						}
						else{
							dup_note = '<b>Ваша заметка:</b><div style="font-size:130%; background-color:#eee;padding:10px;font-family:Times New Roman"><i>'+dup_temp_body_mini+'</i></div>';
						}
					}
					else dup_note = '';
				}else{
					var dup_note = '';
				}

				dup_output = '<table cellspacing="0" cellpadding="0" border="0"><tr>';
				dup_output += '<td valign="top" style="padding-right:10px;"><div style="float:left;margin-bottom:5px">'+dup_name+'<br><span style="font-size:10px"><b>'+dup_country+'</b></span></div>';
				//var image5 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAUCAYAAADlep81AAAAYElEQVRIx2P4DwG9QKwLxAwDhLWAuAWI/4A4XQPoEHRcDSLkBpGDOEEE/yByEMOog0YdNOqgUQeNOmjUQaMOooGDFAeRg4RAxORB5KAWBmgTdhEQewOx8QBhDyCeCXIIABULeHq64cd3AAAAAElFTkSuQmCC';
				//dup_output += '<div style="float:right;margin-left:5px;margin-bottom:5px"><span style="display:block'+((me.config.useImages.value)?';background-image:url('+image5+');background-repeat:no-repeat':'')+';width:36px;height:20px;line-height:20px;text-align:center;color:#fff;background-color:#999"><b></b></span></div>';
				var profile_link_opening = ' <a href="http://d3.ru/user/';
				dup_output += '<div style="clear:both">Автор' + (dup_posts ? profile_link_opening + dup_user_name + '"<b>' + dup_posts + '</b> ' + (dup_posts % 10 == 1 && dup_posts % 100 != 11 ? 'поста':'постов') + '</a>' : '') + (dup_posts && dup_comments ? ' и' + profile_link_opening + dup_user_name + '/comments"':'') + (dup_comments ? profile_link_opening + dup_user_name + '"<b>' + dup_comments + '</b> ' + (dup_comments % 10 == 1 && dup_comments % 100 != 11 ? 'комментария':'комментариев') + '</a>' : '') + '<br>Всего подписчиков: ' + dup_subscribers + '</div>';
				dup_output += '<div style="margin-top:10px">'+dup_votes_him+'</div><div id="dup_my_vote"></div><div id="dup_his_vote"></div><div style="margin-top:10px">'+dup_note+'</div></td><td align="center" valign="top" style="padding-left:10px; border-left:1px #ccc solid;"><span style="color:#444">№'+dup_user_id+'</span><br>'+dup_parent.replace('<a href="/','<a href="http://d3.ru/') +'<div style="margin-top:10px;font-size:10px"><b>Регистрация:</b><br>'+dup_date+'</div><div style="margin-top:5px; font-size: 130%;"><b>Карма: <span style="color:'+((dup_karma>=0)?'green':'red')+'">'+dup_karma+'</span></b></div></td></tr></table>';

				$j('#dup_current_id').val(obj.href);
				//FIXME: get incoming votes				
				//me.dup_getKarma(dup_output,dup_user_id,dup_sex,dup_user_name);
				$j('#dup_data_td').html(dup_output);
			});
		}
	}

});
