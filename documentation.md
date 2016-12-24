# API DOCUMENTATION

###Front page
Request URL : https://onlinemusiclibrary.herokuapp.com/views/frontPage.html  
Request Method : GET  
Data :
* Status :
  - True
  - False
Status Code : 
* 304 Not Modified  
* 200 OK
Remote Address : 46.137.181.240:443  


###Return status of user
Request URL : https://onlinemusiclibrary.herokuapp.com/user/status  
Request Method : GET  
Status Code : 304 Not Modified  
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
* 500 Internal Server Error  
* 200 OK  
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
* 200 OK  
- Request payload:  
- {username: "test", password: "test"}  
- password : "test"  
- username : "test"  

###Return playlists of a user
Request URL:https://onlinemusiclibrary.herokuapp.com/user  
Request Method:GET  
Status Code:200 OK  
Remote Address:54.228.251.241:443  
Data:  Object {user: Object, status: "Login successful!"}  
user received from GET:  Object {error: false, user: Object}  
* user : Object  
- __v : 0  
- _id : "58528a73ef04f6001105a082"  
- playlists : Array[1]  
- username : "test"  

###Return main page with playlists
Request URL:https://onlinemusiclibrary.herokuapp.com/views/playLists.html  
Request Method:GET  
Status Code:200 OK  
Remote Address:54.228.251.241:443  
