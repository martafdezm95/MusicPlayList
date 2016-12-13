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
var routes          =   require('./server/routes/api.js');
var localStrategy   =   require('passport-local' ).Strategy;
var s3 = require('s3');

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
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(mongoUser.authenticate()));
passport.serializeUser(mongoUser.serializeUser());
passport.deserializeUser(mongoUser.deserializeUser());

// routes
app.use('/user/', routes);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});


// Devuelve un Json con todas las songs en la bbdd
//app.get("/songs",song.showAllMemo);

app.get("/playlists:id", playlist.showAllPlaylists);

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

app.post("/playlists", playlist.setPlaylist);

app.get("/user", playlist.getUser);

app.delete("/songs/:id", playlist.deleteSong);

app.delete("/playlists/:id", playlist.deletePlaylist);

//Server error
app.get('/error', function(req,res){
    res.status(404).send('<h1>500 SERVER ERROR</h1>')
});

// error hndlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});

app.listen(process.env.PORT || 8080);
console.log("Listening to PORT 8080");