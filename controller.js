(function(app) {
    function Controller(view, model) {
        this.view = view;
        this.model = model;
        var self = this;
        this.nextUrl = "";
        this.client_id = '85b4b7b32fc398159064fa035c10a3e0';
        this.redirect_uri = 'http://127.0.0.1:8000/callback.html';
        this.model.initialize(this.client_id, this.redirect_uri);
        this.view.bind("signin", function() {
            self.model.authorization(function(user) {
                self.view.toggleLoaderAndLoadMore(true);
                self.view.showUserInfo(user);
                self.onSignIn();
            });

        });
        this.view.bind("clickMenuItem", function(target) {
            self.onMenuItemClick(target);
        });
        this.view.bind("clickContentItem", function(target) {
            self.onContentItemClick(target);
        });
        this.view.bind("searchTrack", function(value) {
            self.onSearchTracks(value);
        });
        this.view.bind("recordsound", function(target) {
            self.onrecordSound(target);
        });
        this.view.bind("loadmore", function() {
            self.onloadMore(self.nextUrl);
        });

    }
    Controller.prototype = {

        onSignIn: function() {
            this.getAndShowTracks({
                url: '/me/followings/tracks'
            });
        },

        onMenuItemClick: function(target) {
            this.view.toggleLoaderAndLoadMore(true);
            this.view.selectMenuItem(target);
            this.view.showContentTitles(target);
            var data = this.view.getContentTracks();
            if (target.id != "upload") {
                this.getAndShowTracks(data);
            }
        },
        onContentItemClick: function(target) {
            this.view.toggleLoaderAndLoadMore(true);
            var t = this.view.selectContentTitle(target);
            var data = this.view.getContentTracks();
            if (t[0].id != "record") {
                this.getAndShowTracks(data);
            }
        },
        onSearchTracks: function(value) {
            var self = this;
            this.view.toggleLoaderAndLoadMore(true);
            this.view.showSearchTitle(value);
            this.model.requestSearchedTracks(value, function(tracks) {
                self.view.showContentTracks(tracks);
                self.view.toggleLoaderAndLoadMore(false);
                self.nextUrl = self.view.storeNextUrl(tracks.next_href);

            });
        },
        onrecordSound: function(target) {
            this.view.selectRecordButton(target);
            var t = target.id,
                self = this;
            if (t === "start-recording") {
                this.model.recordInstructions.startRecording(function(ms) {
                    self.view.updateTimer(ms);
                });
                this.view.nextActiveRecordButtons("start");
            } else if (t === "stop-recording") {
                this.model.recordInstructions.stopRecording();
                this.view.nextActiveRecordButtons("stop");
            } else if (t === "playback") {
                this.view.updateTimer(0);
                this.model.recordInstructions.playRecording(function(ms) {
                    self.view.updateTimer(ms);
                });
                this.view.nextActiveRecordButtons("play");
            } else if (t === "upload-recording") {
                this.model.recordInstructions.uploadRecording(function(track) {
                    self.view.showUploadLink(track);
                });
                this.view.nextActiveRecordButtons("upload");
            }

        },
        onloadMore: function(nexturl) {
            var self = this;
            var data = {
                url: nexturl,
            };
            this.getAndShowTracks(data);
        },
        getAndShowTracks: function(data) {
            var self = this;
            this.model.requestTracks(data, function(tracks) {
                self.view.showContentTracks(tracks);
                self.view.toggleLoaderAndLoadMore(false);
                self.nextUrl = self.view.storeNextUrl(tracks.next_href);
            });
        }
    };
    app.Controller = Controller;
})(window.app);