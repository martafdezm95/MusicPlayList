# API DOCUMENTATION
###Register a user
* URL : /register
* Method : POST
* URL Params :  
* Data Params : 
* Response Codes: Success (200 Registration succesful!), Bad Request (500)

###Log in
* URL : /login
* Method : POST
* URL Params : 
* Data Params :
* Response Codes: Success (200 Login Successful), User not found (401), Could not log in user (500)

###Log out
* URL : /logout
* Method : GET
* URL Params : 
* Data Params :
* Response Codes: Success (200 Out!)

###Show frot page
* URL : /
* Method : GET
* URL Params :  
* Data Params : 
* Response Codes: Success (200)

###Shows all the songs from a playlist
* URL : /playlists:id
* Method : GET
* URL Params :  {params : {userId : $scope.currentUser._id}}
* Data Params : 
* Response Codes: Success (200), Something went wrong (400)

###Return songs from AWS
* URL : /audio
* Method : GET
* URL Params :  
* Data Params : 
* Response Codes: Success (200), Not Found (404)

###Create a new playlist
* URL : /playlists
* Method : POST
* URL Params :  
* Data Params : 
* Response Codes: Success (200), Something went wrong (400)

###Return all the playlists of a user
* URL : /user
* Method : GET
* URL Params :  
* Data Params : 
* Response Codes: Success (200), Not user is logged in (401)

###Delete song
* URL : /songs/:id
* Method : DELETE
* URL Params :  {params: {songPath: path, playlistID : $scope.playlist._id}
* Data Params : 
* Response Codes: Success (200), Something went wrong (400)

###Delete playlist
* URL : /playlists/:id
* Method : DELETE
* URL Params :  {params: {songPath: path, playlistID : $scope.playlist._id}
* Data Params : 
* Response Codes: Success (200), Not Found (404)

###Server error
* URL : /error
* Method : GET
* URL Params : 
* Data Params : 
* Response Codes: SERVER ERROR (404)
