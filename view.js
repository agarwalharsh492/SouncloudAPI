(function(w){
	function View(id){
		this.$bgbefore=$('#bg-initial');
		this.$bgafter=$('#after-sign');
		this.$userimg=$('#user-img');
		this.$username=$('#user-name');
		this.$menuitem=$('.menu-item');
		this.$contentmenu=$('.content-menu');
		this.$titles=$('.titles');
		this.$stream=$('#stream');
		this.$likes=$('#likes');
		this.$record=$('#record');
		this.$hometitle=$('#content-title-home');
		this.$collectiontitle=$('#content-title-Collection');
		this.$uploadtitle=$('#content-title-Upload');
		this.$contenttitles=$('.content-titles');
		this.$isActiveTitle=$('.isActiveTitle');
		this.$widgetlist=$('#widgetlist');
		this.$titleinfo=$('#title-info');
		this.$searchbar=$('#search-tracks');
		this.$recorder=$('#recorder');
		this.$recordbutton=$('.recordbutton');
		this.$activerecorder=$('.active-recorder');
		this.$recordingbuttons=$('#recordingbuttons');
		this.$loader=$('#loader');
		this.$startrecording=$('#start-recording');
		this.$stoprecording=$('#stop-recording');
		this.$play=$('#playback');
		this.$uploadrecording=$('#upload-recording');
	}

	View.prototype={
		initialize:function(id,url){
			SC.initialize({
  				client_id: id,
  				redirect_uri:url,
			});
		},
		getUserInfo:function(){
			
		},
		bind:function(cmd,handler){
			var self= this;
			if(cmd === "signin")
			{
				$('#connect').click(function(e){
					e.preventDefault();
					SC.connect(function(){
    					self.$bgbefore.addClass('hidden');
    					self.$bgafter.removeClass('hidden');
    					self.$loader.removeClass('hidden');
    					SC.get('/me',function(me){
           					self.$userimg.css('background-image', 'url(' + me.avatar_url + ')');
            				self.$username.html(me.username);
            			});

            			SC.get('/me/followings/tracks',{limit:6},function(t){
							$(t).each(function(index,t) {
      								$('#widgetlist').append('<li id='+t.permalink_url+'></li>');
  									SC.oEmbed(t.permalink_url, document.getElementById(t.permalink_url));
  									self.$loader.addClass('hidden');
  								
  							});
 
            			});

            		});
				});
			}
			else if(cmd==="clickMenuItem")
			{
					self.$menuitem.click(function(e){
					handler(e.target);
				});
			}
			else if(cmd==="clickContentItem")
			{
					self.$contenttitles.click(function(e){
					handler(e.target);
				});
			}
			else if(cmd==="searchTrack")
			{
				self.$searchbar.on('keypress',function(event){
					var keycode=event.which,value=self.$searchbar.val();
					if(keycode===13 && value)
					{
						handler(value);
					}
				});
			}
			else if(cmd==="recordsound")
			{
				self.$recordingbuttons.click(function(e){
					handler(e.target);
				});
			}
		},
		selectMenuItem:function(target){
			var self=this;
			var t=target.id;
			self.$menuitem.each(function(){
				$(this).removeClass('isActiveMenu');
			});
			$('#'+t).addClass('isActiveMenu');
		},
		showContentTitles:function(target){
			var self=this;
			var t=target.id;
			self.$contentmenu.each(function(){
				$(this).addClass('hidden');
			});
			self.$titles.each(function(index,item){
				$(item).removeClass('isActiveTitle');
			});
			$('#'+t).addClass('isActiveMenu');

			if(t==="home")
			{
				self.$hometitle.removeClass('hidden');
				this.$stream.addClass('isActiveTitle');

			}
			else if(t==="collection")
			{
				self.$collectiontitle.removeClass('hidden');
				this.$likes.addClass('isActiveTitle');
				
			}
			else if(t==="upload")
			{
				self.$uploadtitle.removeClass('hidden');
				this.$record.addClass('isActiveTitle');

			
			}
		},
		selectContentTitle:function(target){
			var self=this;
			self.$titles.each(function(index,item){
				$(item).removeClass('isActiveTitle');
			});
			$(target).closest(self.$titles).addClass('isActiveTitle');

		},
		getContentTracks:function(handler){
			var self=this;
			var title=$('.isActiveTitle').attr('id');
			self.$recorder.addClass('hidden');
			self.$widgetlist.removeClass('hidden');
			self.$widgetlist.empty();
			self.$titleinfo.empty();
			self.$loader.removeClass('hidden');
			switch(title){
				case "stream":
					self.$titleinfo.append('Hear the latest posts from the people you are following.');

					SC.get('/me/followings/tracks',{limit:6},function(t){
  						handler(t);

  					});
  				break;
  				
  				case "charts":
  					self.$titleinfo.append('Hear the trending tracks of a particular genre.');
  				break;

  				case "likes":
					self.$titleinfo.append('Hear the tracks you have liked:');
					SC.get('/me/favorites',{limit:6},function(t){
						handler(t);
					});
  				break;
  				
  				case "playlists":
					self.$titleinfo.append('Your Awesome Playlists !');
					SC.get('/me/playlists',{limit:6},function(t){
						handler(t);
					});
  				break;
  				
  				case "following":
					self.$titleinfo.append('The people you follow.');
					SC.get('/me/followings/tracks',{limit:6},function(t){
						handler(t);
  					});
  				break;
  				
  				case "record":
  					self.$titleinfo.append('Record your own sound.');
  					self.$recorder.removeClass('hidden');
  					self.$widgetlist.addClass('hidden');
  					self.$loader.addClass('hidden');
  				break;
			}
		},
		showContentTracks:function(t){
				var self=this;
				$(t).each(function(index,t) {
      							self.$widgetlist.append('<li id='+t.id+'></li>');
  								SC.oEmbed(t.permalink_url, document.getElementById(t.id));
  							
  						});
				self.$loader.addClass('hidden');
		},
		displaySearchedTracks:function(tracksName,handler){
			var self=this;
			self.$widgetlist.empty();
			self.$titleinfo.empty();
			self.$titleinfo.append('Search results for   '+tracksName);
			SC.get('/tracks',{q:tracksName,limit:6},function(t){
				handler(t);
			});
		},
		selectRecordButton:function(target){
			var self=this,t=target.id;
			self.$recordbutton.each(function(index,item) {
				$(item).removeClass('active-recorder');
			});
			$(target).addClass('active-recorder');

			if(t==="start-recording")
			{
				self.$startrecording.prop('disabled',true);
				self.$stoprecording.prop('disabled',false);
				self.$play.prop('disabled',true);
				self.$uploadrecording.prop('disabled',true);
				SC.record({	
    				progress: function(ms, avgPeak)
    				{
      					self.updateTimer(ms);
    				}
  				});
			}
			else if(t==="stop-recording")
			{
				self.$play.prop('disabled',false);
				self.$stoprecording.prop('disabled',true);
				self.$uploadrecording.prop('disabled',false);
				SC.recordStop();
			}
			else if(t==="playback")
			{	
				self.$startrecording.prop('disabled',false);
				self.$play.prop('disabled',true);
				self.$uploadrecording.prop('disabled',false);
				self.updateTimer(0);
	    		SC.recordPlay({
	    			progress: function(ms)
	    			{
		         		self.updateTimer(ms);
        			}
    			});
			}
			else if(t==="upload-recording")
			{
				self.$startrecording.prop('disabled',false);
				self.$uploadrecording.prop('disabled',true);
				self.$loader.removeClass('hidden');
				SC.recordUpload({
          			track:
          			{
            			title: 'My Recording',
            			sharing: 'private'
          			}
        			},function(track){
          				self.$loader.addClass('hidden');
          				$('#timer').html("Uploaded: <a href='" + track.permalink_url + "'>" + track.permalink_url + "</a>");
        		});
			}
		},
		updateTimer:function(ms){
			$('#timer').text(SC.Helper.millisecondsToHMS(ms));
		},
	};
	w.app=w.app||{};
	app.View=View;
})(window);