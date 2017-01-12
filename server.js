//Declare variables
var playlists   =   require("./server/models/playlists");
var playlist = require('./server/controllers/playlistController');
var express         =   require("express");
var logger          =   require('morgan');
var cookieParser    =   require('cookie-parser');
var app             =   express();
var bodyParser      =   require("body-parser");
var mongoUser       =   require("./server/models/mongo").User;
var path            =   require("path");
var fs              =   require("fs");
var formidable      =   require("formidable");
var crypto          =   require('crypto');
var passport        =   require('passport');
var debug           =   require('debug')('passport-mongo');
var routes          =   require('./server/controllers/api.js');
var localStrategy   =   require('passport-local' ).Strategy;
var s3 = require('s3');

//AWS keys
process.env.AWS_ACCESS_KEY_ID = "AKIAIS3RUJLQVYLPDPAQ";
process.env.AWS_SECRET_ACCESS_KEY = "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";

var client = s3.createClient({
    s3options: {
        accessKeyId: "AKIAIS3RUJLQVYLPDPAQ",
        secretAccessKey: "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"
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(path.join(__dirname ,'files')));
app.use(express.static(path.join(__dirname ,'public')));
app.use(express.static(path.join(__dirname ,'/')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(mongoUser.authenticate()));
passport.serializeUser(mongoUser.serializeUser());
passport.deserializeUser(mongoUser.deserializeUser());

// Routes for passport
app.use('/user/', routes);

//Default view
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

//Returns all the songs of a playlist
app.get("/playlists:id", playlist.showAllPlaylists);

//Return a song from AWS
app.get('/audio', function(req, res) {

    var params = {
        Bucket: 'omlsongs',
        Key: req.query.path,
    };

    var downloadStream = client.downloadStream(params);

    downloadStream.on('error', function() {
        res.status(404).send('Not Found');
    });
    downloadStream.on('httpHeaders', function(statusCode, headers, resp) {
        // Set Headers
        res.set({
            'Content-Type': headers['content-type']
        });
    });

    // Pipe download stream to response
    downloadStream.pipe(res);
});

//Create a new playlist
app.post("/playlists", playlist.setPlaylist);

//Return all the playlists of the user
app.get("/user", playlist.getUser);

//Remove a song from AWS
app.delete("/songs/:id", playlist.deleteSong);

//Remove a playlist
app.delete("/playlists/:id", playlist.deletePlaylist);

//Server error
app.get('/error', function(req,res){
    res.status(404).send('<h1>Not Found</h1>')
});

// error hndlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
    res.status(err.status || 404);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});

app.listen(process.env.PORT || 8080);
console.log("Listening to PORT 8080");