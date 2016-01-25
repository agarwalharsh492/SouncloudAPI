(function(app) {
    function Model() {}
    Model.prototype = {
        initialize: function(id, url) {
            SC.initialize({
                client_id: id,
                redirect_uri: url,
            });
        },
        authorization: function(handler) {

            SC.connect(function() {

                SC.get('/me', function(user) {
                    handler(user);
                });
            });
        },
        requestTracks: function(data, handler) {

            SC.get(data.url, {
                limit: 6,
                linked_partitioning: 1
            }, function(tracks) {
                handler(tracks);
            });
        },
        requestSearchedTracks: function(tracksName, handler) {
            var data = {
                url: '/tracks',
                query: tracksName
            };
            SC.get(data.url, {
                q: data.query,
                limit: 6,
                linked_partitioning: 1
            }, function(tracks) {
                handler(tracks);
            });
        },

        recordInstructions: {
            startRecording: function(handler) {
                SC.record({
                    progress: function(ms, avgPeak) {
                        handler(ms);
                    }
                });
            },
            stopRecording: function() {
                SC.recordStop();
            },
            playRecording: function(handler) {
                SC.recordPlay({
                    progress: function(ms) {
                        handler(ms);
                    }
                });
            },
            uploadRecording: function(handler) {
                SC.recordUpload({
                    track: {
                        title: 'My Recording',
                        sharing: 'private'
                    }
                }, function(track) {
                    handler(track);
                });

            },
        },

    };

    app.Model = Model;
})(window.app);