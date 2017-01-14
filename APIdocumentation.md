# API DOCUMENTATION

###Front page
Request URL : https://onlinemusiclibrary.herokuapp.com/views/frontPage.html  
Request Method : GET  
Status Code : 
* 304 Not Modified  
* 200 OK  
  
Remote Address : 46.137.181.240:443  

###Return status of user
Request URL : https://onlinemusiclibrary.herokuapp.com/user/status  
Request Method : GET  
Status Code : 
* 304 Not Modified  
* 200 OK  
Data :
  - Status :
    - True
    - False  
    
Remote Address : 46.137.181.240:443  

###Show signup.html after pressing signup button
Request URL : https://onlinemusiclibrary.herokuapp.com/views/signup.html  
Request Method : GET  
Status Code : 200 OK  
Remote Address : 54.217.217.36:443  

###Register user
Request URL : https://onlinemusiclibrary.herokuapp.com/user/register  
Request Method : POST  
Status Code:  
* 400 Internal Server Error  ("UserExistsError" : "A user with the given username is already registered")
* 200 OK  (Registration successful!)
  
Remote Address : 46.137.181.240:443  

###Return sign in form
Request URL : https://onlinemusiclibrary.herokuapp.com/views/signin.html  
Request Method : GET  
Status Code : 304 Not Modified  
Remote Address : 54.228.251.241:443  

###Log in user
Request URL : https://onlinemusiclibrary.herokuapp.com/user/login  
Request Method : POST  
Status Code:  
* 401 Unauthorized  
* 400 Could not log in user
* 200 OK  (Login sucessful!")  
Request payload:  
  - password : "test"  
  - username : "test"  
  
Remote Address : 46.137.181.240:443  

###Return main page with playlists
Request URL:https://onlinemusiclibrary.herokuapp.com/views/playLists.html  
Request Method:GET  
Status Code:200 OK  
Remote Address:54.228.251.241:443  

###Return all the songs from a playlist
Request URL:https://onlinemusiclibrary.herokuapp.com/playlists:id
Request Method : GET  
Status Code:  
* 400  
  Data :
    - Error : True
    - Message : "Something went wrong"
* 200 OK  
  Data :
    - Error : False
    - Message : "Login successful!"
  
Remote Address : 46.137.181.240:443  

###Return a song from AWS
Request URL:https://onlinemusiclibrary.herokuapp.com/audio  
Request Method:GET  
Status Code:  
* 400 Not Found  
* 200 OK  
  
Remote Address : 46.137.181.240:443  

###Return the information of the user
Request URL:https://onlinemusiclibrary.herokuapp.com/user  
Request Method:GET  
Status Code:
* 401 No user is logged in
* 200 OK  
Remote Address:54.228.251.241:443  
Data:  Object {user: Object, status: "Login successful!"}  
User received from GET:  
* error: false  
* user : Object  
  - __v : Integer  
  - _id : Integer  
  - playlists : Array[]  
  - username : String  
  
Remote Address : 46.137.181.240:443  
  
###Create a new playlists
Request URL:https://onlinemusiclibrary.herokuapp.com/playlists  
Request Method:POST  
Status Code:  
* 400  
  Data :  
    - Error : True  
    - Message : "Something went wrong"  
* 200  
  Data :  
    - Error : False  
    - Message : OK  
  
Remote Address : 46.137.181.240:443  

###Remove a playlist
Request URL:https://onlinemusiclibrary.herokuapp.com/playlists/:id
Request Method:DELETE
Status Code:  
* 400  
  Data :  
    - Error : True  
    - Message : "Something went wrong"  
* 200  
  Data :  
    - Error : False  
    - Message : OK  
  
Remote Address : 46.137.181.240:443  

###Remove a song from AWS and from the playlist
Request URL:https://onlinemusiclibrary.herokuapp.com/songs/:id   
Request Method:DELETE  
Status Code:  
* 400  
  Data :  
    - Error : True  
    - Message : "Something went wrong"  
* 200  
  Data :  
    - Error : False  
    - Message : OK  
  
Remote Address : 46.137.181.240:443  

###Log out
Request URL:https://onlinemusiclibrary.herokuapp.com/user/logout  
Request Method:GET  
Status Code:200 OK  
Remote Address:54.228.203.27:443  
Status : "Bye!"  
  
Remote Address : 46.137.181.240:443  

###Server error
Request URL:https://onlinemusiclibrary.herokuapp.com/error
Request Method:GET  
Status Code: 404 Not Found (SERVER ERROR)
Remote Address:54.228.251.241:443 

###API Call Flow
Home page:
    options: 1. Sign-up
             2. Login

    if 1. Sign-up
        User fills out information then presses sign up:
        API Call : POST https://onlinemusiclibrary.herokuapp.com/user/register

    Go to home page

    if 2. Login
        User fills out username and password and presses login:
        API Call : POST https://onlinemusiclibrary.herokuapp.com/user/login

    Go to Playlists page


Playlists Page:
        options: 1. Create Playlist
                 2. Play Song
                 3. Delete Song
                 4. Delete Playlist
                 5. Add Song to playlist

        if 1. Create Playlist
            User fills out playlist name then presses Create:
            API Call : POST https://onlinemusiclibrary.herokuapp.com/playlists

        if 2. Play Song
            User presses play on one of the songs in the playlist
            API Call: POST https://onlinemusiclibrary.herokuapp.com/audio

        if 3. Delete Song
            User presses remove next to song
            API Call: DELETE https://onlinemusiclibrary.herokuapp.com/songs/:id


        if 4. Delete Playlist
            User presses remove before selected playlist
            API Call: DELETE https://onlinemusiclibrary.herokuapp.com/playlists:id


        if 5. Add Song to Playlist
            User presses add song to playlist and fills out the song information and uploads a file
            API Call: Request URL:https://onlinemusiclibrary.herokuapp.com/playlists/:id

In the application after any deletions, additions or modification of the user or playlists,
a GET call is made, to the endpoint: https://onlinemusiclibrary.herokuapp.com/user



