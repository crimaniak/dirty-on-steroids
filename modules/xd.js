// XD
d3.addModule(
    {
        type: "Прочее",
        name: 'XD',
        author: 'Stasik0',

		//-- USAGE EXAMPLES: --
		//this.send("wtf.dirty.ru",  '{"service":"ping"}');
		//this.send("wtf.dirty.ru",  '{"service":"bodyHtml"}', function(re){window.alert(re);});
		//this.send("wtf.dirty.ru",  '{"service":"localStorage"}', function(re){window.alert(re);});
        
/*	// always switched on
        config: {
            active: {type: 'checkbox', value: true}
        },
*/
		parent_url: null,
		callback: null,

        run: function () {
			//receiving facility
			var me = this;
			this.XD.receiveMessage(
				function(message){
					//service function dispatcher
					if (message.data === null || message.data === undefined) return;
					//the data should be in json format
					try{
						var data = d3.json.decode(message.data);
					}catch(e){return;}
					if(data.service === undefined)return;
					
					//returns the body.html as plain text
					if(data.service === "bodyHtml"){
						me.reply('{"service":"callback","value":"'+encodeURIComponent($j('body').html())+'"}',data.parentUrl);
					}
					//returns does the page load with empty callback
					if(data.service === "head"){
						me.reply('{"service":"callback","value":""}',data.parentUrl);
					}
					//returns the localStorage object as JSON string
					if(data.service === "localStorage"){
						if(localStorage)
							me.reply('{"service":"callback","value":"'+encodeURIComponent(d3.json.encode(localStorage))+'"}',data.parentUrl);
					}
					//calls the stored callback with the return data string
					if(data.service === "callback" && data.value !== null){
						if(me.callback != null && Object.prototype.toString.call(me.callback) === "[object Function]"){
							me.callback(decodeURIComponent(data.value));
							//remove the callback
							me.callback=null;
						}
					}
					//ping and pong service without callbacks for testing
					if(data.service === "ping"){
						me.reply('{"service":"pong"}',data.parentUrl);
					}
					if(data.service === "pong"){
						window.alert("pong");
					}
				}, 
				function(domain){return domain.endsWith( d3.content.variant );}
			);
			
			//sending facility
			$j('body').append(d3.newElement( 'iframe',
					{style:     {visibility:'hidden', display:'none', width:'0', height:'0'}
					,attributes:{id:'xd_frame', allowtransparency:'true'}}
			));
        },

		//reply should be only called if the replyer is inside of the iframe
		reply: function(msg, parent_url){
			d3.document.XD = this.XD;
        	//this.XD.postMessage(msg, parent_url);
var script2run = d3.document.createElement('script');
script2run.type = 'text/javascript';
script2run.text = "document.XD.postMessage('"+msg.replace(/'/g,"\\'")+"','"+parent_url+"');";
d3.document.head.appendChild(script2run);
		},

		send: function(url, msg, callback){

			msg = msg.substring(0,msg.length-1)+',"parentUrl":"'+document.location.href.replace(/#.*$/, '')+'"}';
			var src = url;
			this.callback = callback;
//			var me=this;
			//inject XD
			d3.document.XD = this.XD;

//			if($j.browser.webkit)return;
			$j("#xd_frame").unbind().load(function(){
				//me.XD.postMessage(msg, src, frames[0]);
var script2run = d3.document.createElement('script');
script2run.type = 'text/javascript';
script2run.text = "document.XD.postMessage('"+msg+"','"+src+"',window.frames[0]);";
d3.document.head.appendChild(script2run);
			});
			document.getElementById("xd_frame").src = src;
		},

		//slightly modified code from www.onlineaspect.com/2010/01/15/backwards-compatible-postmessage/ follows
		// everything is wrapped in the XD function to reduce namespace collisions
		XD: function(){
			var interval_id = null,
			last_hash = null,
			cache_bust = 1,
			attached_callback,
			window = this;

			return {
				postMessage : function(message, target_url, target) {
				    if (!target_url) {
				        return;
				    }
				    target = target || parent;  // default to parent
				    if (target_url.indexOf( location.protocol + '//' + d3.content.variant )!=0 && window['postMessage']) { //(for some reason dirty.ru does not accept postMessages)
				        // the browser supports window.postMessage, so call it with a targetOrigin
				        // set appropriately, based on the target_url parameter.
				        target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
				    } else if (target_url) {
				        // the browser does not support window.postMessage, so use the window.location.hash fragment hack
				        target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
				    }
				},
				receiveMessage : function(callback, source_origin) {
				    // browser supports window.postMessage (for some reason dirty.ru does not accept postMessages)
				    if (window['postMessage'] && document.location.host != d3.content.variant ) {
				        // bind the callback to the actual event associated with window.postMessage
				        if (callback) {
				            attached_callback = function(e) {
				                if ((typeof source_origin === 'string' && e.origin !== source_origin)
				                || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
				                     return !1;
				                 }
				                 callback(e);
				             };
				         }
				         if (window['addEventListener']) {
				             window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
				         } else {
				             window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
				         }
				     } else {
				         // a polling loop is started & callback is called whenever the location.hash changes
				         interval_id && clearInterval(interval_id);
				         interval_id = null;
				         if (callback) {
				             interval_id = setInterval(function() {
				                 var hash = document.location.hash;
				                 re = /^#?\d+&/;
				                 if (hash !== last_hash && re.test(hash)) {
				                     last_hash = hash;
				                     callback({data: hash.replace(re, '')});
				                 }
				             }, 100);
				         }
				     }
				 }
			};
		}()
	}
);
