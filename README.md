# M7011E Project
This is a web application for the course M7011E Design of Dynamic Web Systems at Luleå University of Technology.

# Description
The problem our website aimed to solve was giving users the ability to upload and sort locally stored music into different playlists to allow for listening on different devices. This way, if a user has purchased music on their computer they will be able to listen to this high quality music anywhere.

# Technologies
The website is build on the MEAN Stack (MongoDB, Express, Angular and NodeJS. It also has a useful framework called Formidable that simplifies forms and taking data from different parts of the page.
For deployment we chose Heroku, a free and popular solution that integrated very well with Amazon S3 cloud storage, used for storing the audio files.
We also use Passport, an authentication middleware that provide the system with account management, database security from unauthorized access and create accounts and store hashed passwords, maintaining its deployment in the system quite simple.

# Software parts
* Front End: It is mainly implemented with AngularJS that is able to manages routes assigning them different views using ngRoute. Also HTML5 is used for developing the views, as well as CSS to style the website. All the Front End is allocated in the public folder.
* Back End: It is developed with node.js, managing all the requests made to the server. All the Back End is allocated in the server folder, as well as the file “server,js”.
* Database: As it was said before, the website count with a simple database based on the NoSQL database program MongoDB.
* Hosting: Heroku is used as the cloud Platform-as-a-Services(PaaS) for the deployment of the website.

# References
For developing the website we research on all the technologies used at diverse websites.
* The documentation of Passport.js at the official website (http://passportjs.org/docs)
* W3schools for learning different web technologies as angular, css or html5 (http://www.w3schools.com)
* Templated, a website that provides a wide variety of templates for websites. We use one as the main template of our website (https://templated.co)
* Heroku Dev Center for learning how to deploy the website with Heroku (https://devcenter.heroku.com)
* Amazon Web Services (AWS) documentation for learning how to upload audio files into the cloud, as well as having access to them.
