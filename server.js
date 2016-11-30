//Requires
var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoUser   =   require("./models/mongo").User;
var mongoSong   =   require("./models/mongo").Songs;
var path        =   require("path");
var router      =   express.Router();
var fs          =   require("fs");
var formidable = require("formidable");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(path.join(__dirname ,'ficheros')));
app.use(express.static(path.join(__dirname ,'public')));
app.use(express.static(path.join(__dirname ,'/')));


// Devuelve un Json con todas las notas en la bbdd
app.get("/songs",function(req,res){
    mongoSong.find({},function(err, data){
        // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

// Añade una nueva nota a la bbdd y almancena el fichero si es necesario
app.post("/songs",function(req,res){
    console.log("Post note");
    var parse = new formidable.IncomingForm();
    parse.parse(req, function(err,fields,files){
        var db = new mongoSong();
        db.artist = fields.artist;
        db.title = fields.title;
        db.file = files.file.name;
        if(files.file.name != ''){
            var name = files.file.name.replace(/ /g,"_");
            fs.rename(files.file.path,"ficheros/"+name, function(err){
                if(err){
                    console.log("Error");
                }else{
                    db.file = name;
                    db.save(function (err) {
                        if (err) console.log("Error");
                    });
                }
            });
        }else{
            db.save(function (err) {
                if (err) console.log("Error");
            });
        }
        res.writeHead(302, {'Location': 'template.html'});
        res.end();
    });

});

//Borra una nota de la bbdd eliminando el fichero si necesario
app.delete("/songs/:id",function(req,res){
    mongoSong.findById(req.params.id,function(err, data){
        mongoSong.remove({"_id":req.params.id},function(err){
            if(err){
                res.writeHead(500, {'Location': '/error'});
                res.end();
            }else{
                if(data.file != ""){
                    mongoSong.find({"fichero":data.file},function (err, data2) {
                        if (data2.length == 0){
                            fs.unlink("ficheros/"+ data.file, function (err) {
                                if (err) console.log("Error deleting the file");
                            });
                        }
                    });
                }
                res.writeHead(302, {'Location': '/'});
                res.end();
            }
        });
    });
});

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