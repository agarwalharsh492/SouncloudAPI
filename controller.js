(function(app){
	function Controller(view){
		this.view=view;
		var self=this;
		this.client_id='85b4b7b32fc398159064fa035c10a3e0';
  		this.redirect_uri='http://127.0.0.1:8000/callback.html';
  		this.view.initialize(this.client_id,this.redirect_uri);
  		this.view.bind("signin");
  		this.view.bind("clickMenuItem",function(target){
  			self.onMenuItemClick(target);
  		});
  		this.view.bind("clickContentItem",function(target){
  			self.onContentItemClick(target);
  		});
  		this.view.bind("searchTrack",function(value){
  			self.onSearchTracks(value);
  		});
  		this.view.bind("recordsound",function(target){
  			self.onrecordSound(target);
  		});

	}
	Controller.prototype={
		onMenuItemClick:function(target){
			var self=this;
			this.view.selectMenuItem(target);
			this.view.showContentTitles(target);
			this.view.getContentTracks(function(t){
				self.view.showContentTracks(t);
			});
			
		},
		onContentItemClick:function(target){
			var self=this;
			this.view.selectContentTitle(target);
			this.view.getContentTracks(function(t){
				self.view.showContentTracks(t);
			});
		},
		onSearchTracks:function(value){
			var self=this;
			this.view.displaySearchedTracks(value,function(t){
				self.view.showContentTracks(t);
			});
		},
		onrecordSound:function(target){
			this.view.selectRecordButton(target);
		},
	};
	app.Controller=Controller;
})(window.app);