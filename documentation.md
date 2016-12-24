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
* 500 Internal Server Error  ("UserExistsError" : "A user with the given username is already registered")
* 200 OK  (Registration successful!)
Remote Address:54.228.251.241:443  

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
* 500 Could not log in user
* 200 OK  (Login sucessful!")  
Request payload:  
  - password : "test"  
  - username : "test"  

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

###Return a song from AWS
Request URL:https://onlinemusiclibrary.herokuapp.com/audio  
Request Method:GET  
Status Code:  
* 400 Not Found  
* 200 OK  

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
    
###Log out
Request URL:https://onlinemusiclibrary.herokuapp.com/user/logout  
Request Method:GET  
Status Code:200 OK  
Remote Address:54.228.203.27:443  
Status : "Bye!"  

###Server error
Request URL:https://onlinemusiclibrary.herokuapp.com/error
Request Method:GET  
Status Code: 404 Not Found (SERVER ERROR)
Remote Address:54.228.251.241:443 
