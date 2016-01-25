(function(w) {
    function View(id) {
        this.$menuitem = $('.menu-item');
        this.$contentmenu = $('.content-menu');
        this.$titles = $('.titles');
        this.$record = $('#record');
        this.$hometitle = $('#content-title-home');
        this.$isActiveTitle = $('.isActiveTitle');
        this.$widgetlist = $('#widgetlist');
        this.$titleinfo = $('#title-info');
        this.$recorder = $('#recorder');
        this.$loader = $('#loader');
        this.$startrecording = $('#start-recording');
        this.$stoprecording = $('#stop-recording');
        this.$play = $('#playback');
        this.$uploadrecording = $('#upload-recording');
        this.$loadmore = $('#load-more');
    }

    View.prototype = {

        showUserInfo: function(me) {
            $('#user-img').css('background-image', 'url(' + me.avatar_url + ')');
            $('#user-name').html(me.username);

        },
        bind: function(cmd, handler) {
            var self = this;
            if (cmd === "signin") {
                $('#connect').click(function(e) {
                    e.preventDefault();
                    $('#bg-initial').addClass('hidden');
                    $('#after-sign').removeClass('hidden');
                    self.$loader.removeClass('hidden');
                    handler();
                });
            } else if (cmd === "clickMenuItem") {
                this.$menuitem.click(function(e) {
                    handler(e.target);
                });
            } else if (cmd === "clickContentItem") {
                $('.content-titles').click(function(e) {
                    handler(e.target);

                });
            } else if (cmd === "searchTrack") {
                $('#search-tracks').on('keypress', function(event) {
                    var keycode = event.which,
                        value = $('#search-tracks').val();
                    if (keycode === 13 && value) {
                        handler(value);
                    }
                });
            } else if (cmd === "recordsound") {
                $('#recordingbuttons').click(function(e) {
                    handler(e.target);
                });
            } else if (cmd === "loadmore") {
                $('#loadbutton').click(function(e) {
                    handler();

                });
            }
        },
        selectMenuItem: function(target) {
            var self = this;
            var t = target.id;
            this.$menuitem.each(function() {
                $(this).removeClass('isActiveMenu');
            });
            $('#' + t).addClass('isActiveMenu');
        },
        showContentTitles: function(target) {
            var self = this;
            var t = target.id;
            this.$contentmenu.each(function() {
                $(this).addClass('hidden');
            });
            this.$titles.each(function(index, item) {
                $(item).removeClass('isActiveTitle');
            });
            if (t === "home") {
                this.$hometitle.removeClass('hidden');
                $('#stream').addClass('isActiveTitle');

            } else if (t === "collection") {
                $('#content-title-Collection').removeClass('hidden');
                $('#likes').addClass('isActiveTitle');

            } else if (t === "upload") {
                $('#content-title-Upload').removeClass('hidden');
                this.$loader.addClass('hidden');
                this.$record.addClass('isActiveTitle');
            }
        },
        selectContentTitle: function(target) {
            this.$titles.each(function(index, item) {
                $(item).removeClass('isActiveTitle');
            });
            var t = $(target).closest(this.$titles);
            t.addClass('isActiveTitle');
            return t;

        },
        getContentTracks: function() {
            var self = this;
            var title = $('.isActiveTitle').attr('id');
            this.$recorder.addClass('hidden');
            this.$widgetlist.removeClass('hidden');
            this.$widgetlist.empty();
            this.$titleinfo.empty();
            var url, tagline;
            switch (title) {
                case "stream":
                    tagline = "Hear the latest posts from the people you are following.";
                    url = '/me/followings/tracks';
                    break;

                case "search":
                    tagline = 'Search tracks by genre,name,etc.';
                    url = '/me/followings/tracks';
                    break;

                case "likes":
                    tagline = 'Hear the tracks you have liked:';
                    url = '/me/favorites';
                    break;

                case "playlists":
                    tagline = 'Your Awesome Playlists !';
                    url = '/me/playlists';
                    break;

                case "following":
                    tagline = 'The people you follow.';
                    url = '/me/followings';
                    break;

                case "record":
                    tagline = 'Record your own sound.';
                    this.$recorder.removeClass('hidden');
                    this.$widgetlist.addClass('hidden');
                    break;
            }
            this.$titleinfo.append(tagline);
            var data = {
                url: url,
            };
            return data;
        },
        showContentTracks: function(t) {
            var self = this,
                arr = [];
            if (t.collection.length === 0) {
                this.$titleinfo.html("No tracks found");
            } else {
                $(t.collection).each(function(index, track) {
                    self.$widgetlist.append('<li id=' + track.id + '></li>');
                    SC.oEmbed(track.permalink_url, document.getElementById(track.id));

                });
            }
        },
        showSearchTitle: function(tracksName, handler) {
            var self = this;
            this.$widgetlist.empty();
            this.$widgetlist.removeClass('hidden');
            this.$titleinfo.empty();
            this.$recorder.addClass('hidden');
            this.$contentmenu.each(function() {
                $(this).addClass('hidden');
            });
            this.$hometitle.removeClass('hidden');
            this.$menuitem.each(function() {
                $(this).removeClass('isActiveMenu');
            });
            this.$titles.each(function(index, item) {
                $(item).removeClass('isActiveTitle');
            });
            $('#home').addClass('isActiveMenu');
            $('#search').addClass('isActiveTitle');
            this.$titleinfo.append("Search results for   " + "'" + tracksName + "'");

        },

        selectRecordButton: function(target) {
            var self = this,
                t = target.id;
            $('.recordbutton').each(function(index, item) {
                $(item).removeClass('active-recorder');
            });
            $(target).addClass('active-recorder');
            this.$loader.addClass('hidden');
        },
        nextActiveRecordButtons: function(button) {
            var enabled = [],
                disabled = [];
            switch (button) {
                case "start":
                    enabled = [this.$stoprecording];
                    disabled = [this.$startrecording, this.$play, this.$uploadrecording];
                    break;

                case "stop":
                    enabled = [this.$play, this.$uploadrecording];
                    disabled = [this.$stoprecording, this.$startrecording];
                    break;

                case "play":
                    enabled = [this.$uploadrecording, this.$startrecording];
                    disabled = [this.$stoprecording, this.$play];
                    break;

                case "upload":
                    enabled = [this.$startrecording];
                    disabled = [this.$stoprecording, this.$play, this.$uploadrecording];
                    break;
            }
            this.enabledRecordButtons(enabled, disabled);

        },
        enabledRecordButtons: function(enabled, disabled) {
            enabled.forEach(function(item, index) {
                item.prop('disabled', false);
            });
            disabled.forEach(function(item, index) {
                item.prop('disabled', true);
            });
        },
        showUploadLink: function(track) {
            $('#timer').html("Uploaded: <a href='" + track.permalink_url + "'>" + track.permalink_url + "</a>");
        },
        updateTimer: function(ms) {
            $('#timer').text(SC.Helper.millisecondsToHMS(ms));
        },
        toggleLoaderAndLoadMore: function(x) {
            x ? this.$loader.removeClass('hidden') : this.$loader.addClass('hidden');
            x ? this.$loadmore.addClass('hidden') : this.$loadmore.removeClass('hidden');
        },
        storeNextUrl: function(nextUrl) {
            if (nextUrl) {
                return nextUrl;
            } else {
                $('#load-more').addClass('hidden');
            }
        }
    };
    w.app = w.app || {};
    app.View = View;
})(window);