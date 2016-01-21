SC.initialize({
  		client_id: '85b4b7b32fc398159064fa035c10a3e0',
  		redirect_uri: 'http://127.0.0.1:8000/callback.html'
	});

    SC.connect(function(){
  //   	
  		$('#bg-initial').hide();
    	$('#after-sign').removeClass('hidden');
    	 SC.get("/tracks", {limit: 1}, function(tracks){
      var track = tracks[0];
      SC.oEmbed(track.uri, document.getElementById("track"));
    });
 
  //   	SC.get('/me',function(me){
  //          $('#user-img').css('background-image', 'url(' + me.avatar_url + ')');
  //           $('#user-name').html(me.username);
  //           });
  //   	SC.get('/me/playlists',function(t){
		
		// for(i=0;i<t.length;i++)
		// 	{
		// 		$('#playerlist').append('<li id='+t[i].permalink_url+'></li>');
  // 				SC.oEmbed(t[i].permalink_url, document.getElementById(t[i].permalink_url));
		// }

		// });
   

          


  
  });

 
   
 

