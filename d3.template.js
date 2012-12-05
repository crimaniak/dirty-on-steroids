//
// ==UserScript==
// @name            Dirty Modular SP
// @author          crimaniak
// @namespace       http://dirty.ru/
// @description     Dirty Modular Service Pack. Core manage extensions settings and provide jQuery service.
// @include         http://dirty.ru/*
// @include         http://www.dirty.ru/*
// @include         http://music.dirty.ru/*
// @include         http://d3.ru/*
// @include         http://*.d3.ru/*
// @run-at          document-end
// @all_frames      true
// @version         0.0.3
// ==/UserScript==

// @jQuery@

var $j=jQuery.noConflict();	// $j closure used for jQuery to avoid conflict with mootools $()

var d3=
{
	modules: [],
	modulesByName : {},
	contentModules: [],
	runTimeTotal: 0,
	processingStartTime: (new Date()).getTime(),
	buildMode: '@buildMode@',
	
	/// Search module by name
	getModule: function(name){
		return (this.modulesByName[name] == undefined) ? null : this.modulesByName[name];
	},
	user:
	{
		id: null,
		name: null
	},
	
	// storage will be cross-domain in future
	storage:
	{
		get: function(key, defaultValue)
		{
			var value = localStorage.getItem(key);
			return value === null ? defaultValue : value;
		},
		set: function(key, value)
		{
			return localStorage.setItem(key, value);
		},
		remove: function(key)
		{
			return localStorage.removeItem(key);
		}
	},

	/// Set style properties
	setStyle: function(element,style)
	{
		for(var i in style)
			element.style[i]=style[i];
	},

	/**
	 * Function to create new element and set attributes, style and innerHTML property
	 * @param tagName string tag name
	 * @param parms object with possible keys: style, attributes, innerHTML
	 * @returns newly created element
	 */
	newElement: function(tagName,parms)
	{
		var e=document.createElement(tagName);
		
		var i;
		if(parms.style!==undefined) this.setStyle(e,parms.style);
		if(parms.attributes!==undefined) for(i in parms.attributes)	e.setAttribute(i,parms.attributes[i]);	
		if(parms.innerHTML!==undefined)	e.innerHTML=parms.innerHTML;
		
		return e;
	},

	/// newElement('div',...) shortcut
	newDiv: function(parms) { return this.newElement('div', parms); },
	
	/// JSON helper
	json:
	{
		encode: function(value) {return (JSON.stringify != undefined ? JSON.stringify:JSON.encode)(value);},
		decode: function(value)	{return (JSON.parse != undefined ? JSON.parse:JSON.decode)(value);}		
	},
	
	/// Add content module
	addContentModule: function(mask, module)
	{
		this.contentModules.push({mask:mask, module: module});
	},
	
	initContentModules: function()
	{
		this.contentModules.forEach(function(item){
			if(document.location.hostname.match(item.mask))
				item.module.run();
		});
	},

	/// Add and run d3 module
	addModule: function(module)
	{
		this.modules.push(module);
		if(this.modulesByName[module.name] != undefined)
			if(console)console.log('Duplicate module '+module.name);
		this.modulesByName[module.name] = module;
	},

	runAll: function () {
		var xd = d3.getModule("XD");
		if (document.location.hostname == "d3.ru" || !xd) {
			this.runModules();
		} else {
			xd.run();
			xd.send.call(xd, "http://d3.ru/search/?xd-request", '{"service":"localStorage"}',
				function (ls) {
					var remoteStorage = d3.json.decode(ls);
					var decodedData = d3.json.decode(remoteStorage["dirtySpm"]);
					console.log("decoded data", decodedData);
					if (decodedData) {
						d3.config.data = decodedData;
					}
					d3.runModules();
					if (console) console.log('modules runtime: ' + d3.runTimeTotal + 'ms');
					if (console) console.log('time from start: ' + ((new Date()).getTime() - d3.processingStartTime) + 'ms');
				}
			);
		}
	},

	runModules: function () {

		var log = console && this.buildMode=='Dev';
		var xdRequest = window.location.href.indexOf("xd-request") != -1;
		console.log("XDrequest", xdRequest);
		this.modules.forEach(function(module){
			d3.config.addModule(module);

			if ((xdRequest == (module.name == "XD")) &&
				(module.config == undefined || module.config.active == undefined || module.config.active.value))
			{
				var timeBefore = (new Date()).getTime();
				var moduleTimingInfo = {};

				if (module.run != undefined) {
					try {
						module.run();
						moduleTimingInfo["run"] = ((new Date).getTime() - timeBefore)+"ms";
					} catch (e) {
						if (log) console.log("Error in module '" + module.name + "'", e);
					}
				}

				try {
					if (module.onPost != undefined) {
						var startTime = (new Date()).getTime();
						d3.content.onNewPost(function (post) {
							module.onPost(post);
						});
						d3.content.posts.forEach(function (post) {
							module.onPost(post);
						});
						moduleTimingInfo["onPost"] = ((new Date).getTime() - startTime)+"ms";
					}
				} catch (e) {
					if (log) console.log("Error processing posts in module '" + module.name + "'", e);
				}

				try {
					if (module.onComment != undefined) {
						var startTime = (new Date()).getTime();
						d3.content.onNewComment(function (comment) {
							module.onComment(comment);
						});
						d3.content.comments.forEach(function (comment) {
							module.onComment(comment);
						});
						moduleTimingInfo["onComment"] = ((new Date).getTime() - startTime)+"ms";
					}
				} catch (e) {
					if (log) console.log("Error processing comments in module '" + module.name + "'", e);
				}

				var handleBatchEvent = function(eventName, handler, runNow) {
					try {
						if (module[eventName] != undefined) {
							var startTime = (new Date()).getTime();
							handler(function () {
								module[eventName]();
							});
							if (runNow) {
								module[eventName]();
							}
							moduleTimingInfo[eventName] = ((new Date).getTime() - startTime)+"ms";
						}
					} catch (e) {
						if (log) console.log("Error running "+eventName+" in module '" + module.name + "'", e);
					}
				};

				handleBatchEvent("onPostsUpdated", function (fn) {
					d3.content.onPostsUpdated(fn);
				}, d3.content.posts.length);
				handleBatchEvent("onCommentsUpdated", function (fn) {
					d3.content.onCommentsUpdated(fn);
				}, d3.content.comments.length);
				handleBatchEvent("onItemsUpdated", function (fn) {
					d3.content.onItemsUpdated(fn);
				}, d3.content.posts.length || d3.content.comments.length);

				var moduleRunTime = (new Date()).getTime() - timeBefore;
				d3.runTimeTotal += moduleRunTime;
				if (log) console.log( module.name + ": " + moduleRunTime + "ms;  "+JSON.stringify(moduleTimingInfo));
			}
		});
	},

	// Config core module
	config:
	{
		type: "Настройки",
		author: 'crimaniak',
		name: 'config core module',
		data: {},	/// config values
		controls: {}, /// Controls sorted by sheets

		/// Add link to config box
		run: function()
		{
			d3.content.addConfigLink('configLink');
			$j('#configLink').click(function(event){d3.config.getBox().show();return false;});
		},
		/// Init and return config box
		getBox: function()
		{
			if(this.box==undefined)
				this.box=this.drawBox();
			return this.box;
		},
		/// Calculate HTML-friendly id from module and control names
		controlName: function(module,control){return 'A'+Math.abs(crc32(module))+'_'+control;},
		/// Draw config box
		drawBox: function()
		{
			var box=$j(d3.newElement('div'
				,{style:{position:'fixed',top:($j(window).height()/2-150)+'px',left:($j(window).width()/2-300)+'px',width:'600px',height:'300px',backgroundColor: '#FFFFCC',border:'1px grey solid',zIndex: '1000',padding:'0 1ex'}
				 ,attributes:{id:'configBox'}
				 ,innerHTML:'Настройки сервис-пака <a id="configCloser" style="position:absolute;right:1ex;top:0px;cursor:pointer">закрыть</a><div id="configTabs"></div>'}));
			$j('body').append(box);
			$j('#configCloser').click(function(event){box.hide();d3.config.readAndSave();return false;});
			
			this.tabs=new TabSheets($j('#configTabs'));
			for(var sheetName in this.controls)
				this.tabs.addSheet(sheetName, this.drawSheet(this.controls[sheetName]));
			
			return box;
		},
		/// Draw one control sheet
		drawSheet: function(data)
		{
			var html='<table style="width: 100%; border:0px; border-collapse:collapse; padding: 0px"><col width="24"></col><tbody>';
			for(var id in data){
				if(data[id].name=='active'){
					html += '<tr><td colspan="2" style="height: 20px;"><div style="padding-top:8px;"><div style="height: 1px; background-color: black;"><span style="background-color: white; position: relative; top: -0.8em; left: 20px;">Модуль "'+data[id].caption+'"</span></div></div></td></tr>';
					data[id].caption = "Активировать";				
				}
				html+=data[id].draw();
			}
			return html+'</tbody></table>';
		},
		/// Control constructor
		Control: function(module,name)
		{
			this.module=module;
			this.name=name;
			module.config[this.name]._control=this;
			
			this.setValue=function(newValue) {d3.config.data[this.id]=this.module.config[this.name].value=this.value=newValue;};
			this.getValue=function() {return $j('#'+this.id).val();};
			this.update=function() {this.setValue(this.getValue());};
			
			// collect properties from config data
			for(var i in module.config[name])
				this[i]=module.config[name][i];
			// collect methods from control prototype
			for(i in d3.config[this.type])
				this[i]=d3.config[this.type][i];
			// set id
			this.id=d3.config.controlName(module.name, name);
			// set default caption
			if(this.caption == undefined)
				this.caption = name=='active' ? module.name : name;
			// get saved value if exists
			if(d3.config.data[this.id]!=undefined)
				this.setValue(d3.config.data[this.id]);
		},
		checkbox:
		{
			draw: function()
			{
				return '<tr><td><input type="checkbox" id="'+this.id+'" name="'+this.id+'"'+(this.value ? ' checked' : '')+'></td><td><label for="'+this.id+'">'+this.caption+'</label></td></tr>';
			},

			getValue: function() {return $j('#'+this.id).attr('checked') ? true : false;}
		},
		text:
		{
			draw: function()
			{
				return '<tr><td colspan="2"><label>'+this.caption+'<input type="text" id="'+this.id+'" name="'+this.id+'" value="'+this.value+'"></label></td></tr>';
			}
		},
		html:
		{
			draw: function()
			{
				return '<tr><td colspan="2">'+this.value+'</td></tr>';
			},
			getValue: function(){return this.module.config[this.name].value;}
		},
		hidden:
		{
			draw: function(){return '';},
			getValue: function(){return this.module.config[this.name].value;}
		},
		radio:
		{
			draw: function()
			{
				if(this.columns == undefined)
				{
					this.columns=0;
					for(var i in this.options) this.columns++; // Opera doesn't support Object.keys
					this.columns=Math.floor(Math.sqrt(this.columns));
				}
				var html='<tr><td colspan="2">'+this.caption+'</td></tr><tr><td></td><td><table><tbody><tr>';
				var counter=1;
				for(var i in this.options)
				{
					if((++counter % this.columns) == 0 && counter>2) html+='</tr><tr>';
					html+='<td><label><input type="radio" name="'+this.id+'" value="'+this.options[i]+'"'+(this.options[i]==this.value?' checked':'')+'> '+i+'</label></td>';
				}
				return html+'</tr></tbody></table></td></tr>';
			},

			getValue: function() {return $j('input:radio[name='+this.id+']:checked').val();}
		},
		select:
		{
			draw: function()
			{
				var html='<tr><td colspan="2">'+this.caption+' <select name="'+this.id+'" id="'+this.id+'">';
				for(var i in this.options)
				{
					html+='<option value="'+this.options[i]+'"'+(this.options[i]==this.value?' selected':'')+'> '+i+'</option>';
				}
				return html+'</select></td></tr>';
			},
			
			getValue: function() {return $j('select#'+this.id+' option:selected').val();}
		},
		/// Get new values from controls and save config to storage
		readAndSave: function()
		{
			for(var sheet in this.controls)
				for(var id in this.controls[sheet])
					this.controls[sheet][id].update();
			this.save();
		},
		/// Save config to storage
		save: function()
		{
			d3.storage.set('dirtySpm',d3.json.encode(this.data));
		},
		/// Load config from storage
		load: function()
		{
			var saved=d3.storage.get('dirtySpm', null);
			if(saved !== null)
				this.data=d3.json.decode(saved);
		},
		/// Add module config data, add controls and load saved values
		addModule: function(module)
		{
			// if no config data then return
			if(module.config == undefined) return;
			
			// create this type sheet if not exists 
			if(this.controls[module.type]== undefined)
				this.controls[module.type]={};
			
			// create controls
			for(var i in module.config)
			{
				var control=new this.Control(module,i);
				this.controls[module.type][control.id]=control;
			}
		}
	},
	
	initCore: function()
	{
		this.getOriginal();
		this.initContentModules();
		this.user = this.content.findUser();
		this.config.load();
		this.addModule(d3.config);
		
		this.window.d3=this;
	},

	/// Get original window and document objects
	getOriginal: function()
	{
		if($j.browser.opera)
		{
			this.window=window;
			this.document=document;
		}else if($j.browser.mozilla)
		{
			this.window=unsafeWindow;
			this.document=document.wrappedJSObject;
		}else
		{
			var retval=d3.newElement('div',{attributes:{onclick:"return {window:window,document:document};"}}).onclick();
			this.window=retval.window;
			this.document=retval.document;
		}
	},
	xpath:
	{
		get:	function(selector,context)
		{
			if(context==undefined) context=document;
			return document.evaluate(selector,context,document.createNSResolver(document),XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		},
		each:	function(selector,handler,context)
		{
			var nodes=this.get(selector, context);
			for (var i = 0; i < nodes.snapshotLength; i++) 
	             if(handler(nodes.snapshotItem(i),i)===false) return false;
			return true;
		}
	}
};

// @corelibs@
// @contentModules@

d3.initCore();

try
{
// @modules@
	d3.runAll();
}catch(e)
{
	if(console) console.log(e);
}

if (console) console.log('runtime: ' + d3.runTimeTotal + 'ms');
