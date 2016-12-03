//Requires
var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoUser   =   require("./server/models/mongo").User;
var mongoSong   =   require("./server/models/mongo").Songs;
var songs       =   require("./server/models/songs")
var path        =   require("path");
var router      =   express.Router();
var fs          =   require("fs");
var formidable = require("formidable");
var crypto = require('crypto');
var song = require('./server/controllers/songController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(path.join(__dirname ,'ficheros')));
app.use(express.static(path.join(__dirname ,'public')));
app.use(express.static(path.join(__dirname ,'/')));


// Devuelve un Json con todas las songs en la bbdd
app.get("/songs",song.showAllMemo);

// Añade una nueva song a la bbdd y almancena el fichero si es necesario
app.post("/songs", song.setMemo);

app.delete("/songs/:id", song.deleteMemo);

//Server error
app.get('/error', function(req,res){
    res.status(404).send('<h1>500 SERVER ERROR</h1>')
});

//Not Found
app.get('*', function(req,res){
    console.log(req.path);
    res.status(404).send('<h1>404 This is not the Webpage you are looking for</h1>')
});

app.listen(process.env.PORT || 8080);
console.log("Listening to PORT 8080");