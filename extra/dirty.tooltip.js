// Dirty tooltip
d3.addModule(
{
	type: "Прочее",
	name: 'Dirty tooltip',
	author: 'NickJr, Stasik0, and the rest of gang',
	config: {
		active:{type:'checkbox',value:true},
		useImages:{type:'checkbox',value:true,caption:'Картинки для tooltip'}
		},

	showing: 0,
	processing: 0,

	run: function(){
		this.processLinks($j(document.body));
	},

	processLinks: function(elem){
		if(!this.config.active.value)return;
		var me = this;
		var links = $j('a', elem);
		for(var i=0; i<links.length; i++){
			var href = links[i].href.toString();
			//either /user/ or /users/ appers in link, /users/ must not be the ending
			if((href.indexOf('/user/')>0 || (href.indexOf('/users/')>0 && href.lastIndexOf('/users/') != href.length-7)) &&
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
			$j(document.body).append('<div id="dup_div" style="position: absolute; z-index: 1300;"></div>');
			dup_div = $j('#dup_div');
			$j(document).click(function(){
					$j('#dup_div').css('display', 'none');
				}
			);
		}

		//populate the div
		if(this.config.useImages.value){
			dup_div.html('<input type="hidden" id="dup_current_id" value=""><table cellspacing="0" cellpadding="0" border="0"><tr><td width="20" height="35" style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png)"></td><td style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-082056-66b834efdae258a95d3a6e1139ca6aa7.png);background-position:-20px 0"><div style="width:100px;height:35px;background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:-20px 0"></div></td><td width="20" style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:right top"></td></tr><tr><td style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:0 -35px"></td><td style="background-color:#fff;font-size:10px;padding:0 10px 15px 0;line-height:16px" id="dup_data_td"></td><td style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:right -35px"></td></tr><tr><td height="20" style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:0 bottom"></td><td style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-082056-66b834efdae258a95d3a6e1139ca6aa7.png);background-position:-20px bottom"></td><td style="background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-061726-d653bb4135a280a228108b2990ef42de.png);background-position:right bottom"></td></tr></table>');
		}else{
			dup_div.html('<input type="hidden" id="dup_current_id" value=""><div style="border-right:1px solid #a1a1a1;border-bottom:1px solid #a1a1a1"><div style="background-color:#fff;border:1px solid #505050;font-size:10px;padding:14px;line-height:16px" id="dup_data_td"></div></div>');
		}

		//caching
		if($j("#dup_current_id").val()!=obj.toString()){
			dup_div.css('display', 'none');
			if(this.config.useImages.value){
				$j("#dup_data_td").html('<center><div style="width:150px;height:60px;background-repeat:no-repeat;background-position:center;background-image:url(http://pit.dirty.ru/dirty/1/2010/04/23/11119-023914-a435e3f34c6e355b6bef6594195f3bd7.gif)">&nbsp;</div></center>');
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
				me.dup_getData(obj);
		},700);
	},

	dup_getData: function(obj){
		if(this.processing==1){
			var me=this;
			$j.get(obj.href, function(data){
				var dup_text = data;
				if(dup_text.indexOf(' onclick="voteHandler.vote(this, \'')==-1){
					var dup_user_id = d3.user.name;
					var dup_user_name = d3.user.name;
				}
				else{
					var dup_user_id = dup_text.split(' onclick="voteHandler.vote(this, \'')[1].split('\'')[0];
					var dup_user_name = obj.href.split('/');
					dup_user_name = dup_user_name[dup_user_name.length-2];
				}

				if(dup_text.split('<span>с нами с ').length < 2){
					var dup_date = "неизвестно";
				}else{
					var dup_date = dup_text.split('<span>с нами с ')[1].split(' года')[0];
				}
				var dup_karma = dup_text.split(' onclick="voteDetailsHandler.show({type:\'karma\'')[1].split('>')[1].split('<')[0];
				var dup_pluses = dup_text.split('plus voted').length-1;
				var dup_minuses = dup_text.split('minus voted').length-1;

				dup_pluses = (dup_pluses>0)?'<span style="color:green;"><b>+'+dup_pluses+'</b></span>':0;
				dup_minuses = (dup_minuses>0)?'<span style="color:red;"><b>-'+dup_minuses+'</b></span>':0;

				var dup_votes_him = '';
				if(dup_minuses!==0) dup_votes_him += dup_minuses;
				if(dup_minuses!==0&&dup_pluses!==0) dup_votes_him += ' <span style="color:#ccc">/</span> ';
				if(dup_pluses!==0) dup_votes_him += dup_pluses;

				var dup_parent = dup_text.split(' по приглашению ')[1].split('</div>')[0];

				var dup_name = dup_text.split('<div class="userbasicinfo">')[1].split('<h3>')[1].split('</div>')[0];
				dup_name = dup_name.split('</h3>').join('');
				for(var i=0;i<2;i++) dup_name = dup_name.split('&#35;').join('#').split('&#59;').join(';').split('&amp;').join('&');

				var dup_country = dup_name.split('<div class="userego">')[1];

				var dup_raitdata = dup_text.split('<div class="userstat userrating">')[1];
				dup_raitdata = dup_raitdata.split('<div class="clear">')[0];

				var dup_sex = (dup_raitdata.indexOf('аписала')>-1)?'f':'m';
				var dup_posts = (dup_raitdata.indexOf('/posts/">')>-1)?parseInt(dup_raitdata.split('/posts/">')[1].split(' ')[0]):0;
				var dup_comments = (dup_raitdata.indexOf('/comments/">')>-1)?parseInt(dup_raitdata.split('/comments/">')[1].split(' ')[0]):0;
				var dup_vote = dup_raitdata.split(' голоса&nbsp;&#8212; ')[1].split('<')[0];

				if(dup_posts!=0||dup_comments!=0){
					var dup_raiting = parseInt(dup_raitdata.split('рейтинг ')[1].split('<')[0]);
				}
				else var dup_raiting = 0;

				dup_name = dup_name.split('<div class="userego">')[0];
				dup_name = '<span style="font-size:130%;color:#'+((dup_sex=='m')?'009ced':'ff4fdc')+'"><b>'+dup_name+'</b></span>';

	//			dup_votes_him = (dup_votes_him!='')?'<b>Ваша оценка:</b> '+dup_votes_him:'<span style="color:#999"><b>Ваших оценок нет в '+((dup_sex=='f')?'её':'его')+' карме</b></span>';
				dup_votes_him = '';

				var dup_prop = Math.round((dup_raiting/(dup_posts+dup_comments))*10)/10;

				var dup_userpic = '';

				if(me.config.useImages.value){
					if(dup_text.indexOf('alt="Dirty Avatar"')>0){
						dup_userpic = dup_text.split('alt="Dirty Avatar"')[0];
						dup_userpic = dup_userpic.split('src="');
						dup_userpic = dup_userpic[dup_userpic.length-1].split('"')[0];
					}
					else if(dup_text.indexOf('#Dirty Avatar#')>0){
						dup_userpic = dup_text.split('#Dirty Avatar#')[1].split('src="')[1].split('"')[0];
					}
					else{
						dup_check_avatar = dup_text.split('<table class="userpic">')[1].split('<td>')[1].split('</td>')[0];
						if(dup_check_avatar.indexOf('<img')>0){
							dup_userpic = dup_check_avatar.split('src="')[1].split('"')[0];
						}
					}

					if(dup_userpic!='') dup_userpic = '<img src="http://www.amaryllis.nl/cmm/tools/thumb.php?src='+dup_userpic+'&maxw=70&maxh=100" border="0" alt=""><br>';
					else dup_userpic = '<div style="width:75px;height:75px;background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-074626-d60640dc88fd86bcef83e920d94a8797.png);background-position:'+((dup_sex=='m')?'left':'-75px')+' top">&nbsp;</div>';
				}
				else{
					if($j.browser.opera){
						if(dup_sex=='m') dup_userpic = '<div style="width:66px;height:70px;color:#d2dae2;border:1px solid #919191;font-family:Verdana;text-align:center;font-size:50px;line-height:70px">♂</div>';
						else dup_userpic = '<div style="width:66px;height:70px;color:#e2d2d9;border:1px solid #919191;text-align:center;font-size:50px;line-height:70px">♀</div>';
					}
					else{
						if(dup_sex=='m') dup_userpic = '<div style="width:66px;color:#d2dae2;border:1px solid #919191;text-align:center;font-size:4px;line-height:4px"><pre>  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~~~~       ~~~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~             ~~~~~~~~  '+"\r\n"+'  ~~~~~~~               ~~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                  ~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~~                ~~~~~~  '+"\r\n"+'  ~~~~~~~~              ~~~~~~~  '+"\r\n"+'  ~~~~~~~~             ~~~~~~~~  '+"\r\n"+'  ~~~~~~~~~           ~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~             ~~~~~~~~  '+"\r\n"+'  ~~~                      ~~~~  </pre></div>';
						else dup_userpic = '<div style="width:66px;color:#e2d2d9;border:1px solid #919191;text-align:center;font-size:4px;line-height:4px"><pre>  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~~~~       ~~~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~~           ~~~~~~~~~  '+"\r\n"+'  ~~~~~~~~             ~~~~~~~~  '+"\r\n"+'  ~~~~~~~               ~~~~~~~  '+"\r\n"+'  ~~~~~~~               ~~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                 ~~~~~~  '+"\r\n"+'  ~~~~~~                ~~~~~~~  '+"\r\n"+'  ~~~~~~~               ~~~~~~~  '+"\r\n"+'  ~~~~~~~               ~~~~~~~  '+"\r\n"+'  ~~~~                    ~~~~~  '+"\r\n"+'  ~~~~~                  ~~~~~~  '+"\r\n"+'  ~~~~~~~~             ~~~~~~~~  '+"\r\n"+'  ~~~                      ~~~~  '+"\r\n"+'</pre></div>';
						dup_userpic = dup_userpic.split('~').join('█');
					}
				}


				if(dup_text.split('id="js-usernote">').length >= 2){
					var dup_note = dup_text.split('id="js-usernote">')[1].split('</em>')[0];
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

				dup_output = '<table cellspacing="0" cellpadding="0" border="0"><tr><td align="center" valign="top" style="padding-right:10px">'+dup_userpic+'<span style="color:#444">№'+dup_user_id+'</span><br>'+dup_parent+'<div style="margin-top:10px;font-size:10px"><b>Регистрация:</b><br>'+dup_date+'</div><div style="margin-top:5px; font-size: 130%;"><b>Карма: <span style="color:'+((dup_karma>=0)?'green':'red')+'">'+dup_karma+'</span></b></div></td>';
				dup_output += '<td valign="top"><div style="float:left;margin-bottom:5px">'+dup_name+'<br><span style="font-size:10px"><b>'+dup_country+'</b></span></div>';
				dup_output += '<div style="float:right;margin-left:5px;margin-bottom:5px"><span style="display:block'+((me.config.useImages.value)?';background-image:url(http://pit.dirty.ru/dirty/1/2010/04/24/11119-071559-e56ce92235e2c35c7531f9cb843ffa0d.png);background-repeat:no-repeat':'')+';width:36px;height:20px;line-height:20px;text-align:center;color:#fff;background-color:#999"><b>'+dup_prop+'</b></span></div>';
				dup_output += '<div style="clear:both">Автор <b>'+dup_posts+'</b> постов и <b>'+dup_comments+'</b> комментариев<br>Заработал'+((dup_sex=='f')?'а':'')+' голос <span style="color:#0069ac; font-size:130%;"><b>'+dup_vote+'</b></span> и рейтинг '+dup_raiting+'</div>';
				dup_output += '<div style="margin-top:10px">'+dup_votes_him+'</div><div id="dup_my_vote"></div><div id="dup_his_vote"></div><div style="margin-top:10px">'+dup_note+'</div></td></tr></table>';

				$j('#dup_current_id').val(obj.href);

				me.dup_getKarma(dup_output,dup_user_id,dup_sex,dup_user_name);
			});
		}
	},

	dup_getKarma: function(dup_text,dup_user_id,dup_sex,dup_user_name){
		if(dup_user_id!=d3.user.id){
			//incoming karma
			var url = '/karmactl';
			var data = 'view='+d3.user.id;
			$j.post(url,data,function(data){
				var dup_temp = data;
				if(dup_temp.indexOf('{"uid":"'+dup_user_id+'"')>0){
					dup_temp = dup_temp.split('{"uid":"'+dup_user_id+'"')[1].split('","login"')[0].split('"');
					dup_temp = dup_temp[dup_temp.length-1];
					dup_temp = '<b>'+((dup_sex=='f')?'Её':'Его')+' оценка вас: <span style="color:'+((dup_temp>0)?'green">+':'red">')+dup_temp+'</span></b>';

					$j('#dup_his_vote').html(dup_temp);
				}else{
					$j('#dup_his_vote').html('<span style="color:#999"><b>Е'+((dup_sex=='f')?'ё':'го')+' оценок нет в вашей карме</b></span>');
				}
			});
			//outgoing karma
			var url = '/karmactl';
			var data = 'view='+dup_user_id;
			$j.post(url,data,function(data){
				var dup_temp = data;
				if(dup_temp.indexOf('{"uid":"'+d3.user.id+'"')>0){
					dup_temp = dup_temp.split('{"uid":"'+d3.user.id+'"')[1].split('","login"')[0].split('"');
					dup_temp = dup_temp[dup_temp.length-1];
					dup_temp = '<b>Ваша оценка '+((dup_sex=='f')?'её':'его')+': <span style="color:'+((dup_temp>0)?'green">+':'red">')+dup_temp+'</span></b>';

					$j('#dup_my_vote').html(dup_temp);
				}else{
					$j('#dup_my_vote').html('<span style="color:#999"><b>Ваших оценок нет в е'+((dup_sex=='f')?'ё':'го')+' карме</b></span>');
				}
			});
		}
		$j('#dup_data_td').html(dup_text);
	}



});
