/**
 * Autor: Alejandro Solanas Bonilla
 * NIA: 647647
 * Fichero: server.js
 * Fecha: 29/5/2016
 * Funcion: API REST Nodejs y Express, que permite la gestion de usuarios y notas. Servidor en el puerto 3000
 */


//Requires
var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoUser   =   require("./models/mongo").User;
var mongoNote   =   require("./models/mongo").Notes;
var path        =   require("path");
var router      =   express.Router();
var fs          =   require("fs");
var formidable = require("formidable");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static(path.join(__dirname ,'ficheros')));

//Resource users
router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoUser.find({},function(err,data){
            // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        console.log(req.body);
        var db = new mongoUser();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.user = req.body.email;
        // Hash the password using SHA1 algorithm.
        db.pass =  require('crypto')
            .createHash('sha1')
            .update(req.body.password)
            .digest('base64');

        db.save(function(err){
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
                res.json(response);

            } else {

                mongoUser.find({},function(err,data){
                    // Mongo command to fetch all data from collection.
                    if(err) {
                        response = {"error" : true,"message" : "Error fetching data"};
                    } else {
                        response = {"error" : false,"message" : data};
                    }
                    res.json(response);
                });

            }
        });
    });

//Resource users/:id
router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        mongoUser.findById(req.params.id,function(err,data){
            // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoUser.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // we got data from Mongo.
                // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.user = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.pass = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
        var response = {};
        // find the data
        mongoUser.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoUser.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                        res.json(response);
                    } else {

                        mongoUser.find({},function(err,data){
                            // Mongo command to fetch all data from collection.
                            if(err) {
                                response = {"error" : true,"message" : "Error fetching data"};
                            } else {
                                response = {"error" : false,"message" : data};
                            }
                            res.json(response);
                        });

                    }
                });
            }
        });
    });

// Devuelve un Json con todas las notas en la bbdd
app.get("/notes",function(req,res){
    mongoNote.find({},function(err,data){
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
app.post("/notes",function(req,res){
    console.log("Post note");
    var parse = new formidable.IncomingForm();
    parse.parse(req, function(err,fields,files){
        var db = new mongoNote();
        db.fecha = fields.fecha;
        db.texto = fields.texto;
        db.fichero = files.fichero.name;
        if(files.fichero.name != ''){
            var nombre = files.fichero.name.replace(/ /g,"_");
            fs.rename(files.fichero.path,"ficheros/"+nombre, function(err){
                if(err){
                    console.log("Error");
                }else{
                    db.fichero = nombre;
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
        res.writeHead(302, {'Location': '/'});
        res.end();
    });

});

//Borra una nota de la bbdd eliminando el fichero si necesario
app.delete("/notes/:id",function(req,res){
    mongoNote.findById(req.params.id,function(err,data){
        mongoNote.remove({"_id":req.params.id},function(err){
            if(err){
                res.writeHead(500, {'Location': '/error'});
                res.end();
            }else{
                if(data.fichero != ""){
                    mongoNote.find({"fichero":data.fichero},function (err,data2) {
                        if (data2.length == 0){
                            fs.unlink("ficheros/"+ data.fichero, function (err) {
                                if (err) console.log("Error al eliminar fichero");
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

//Main page
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

//Fichero angular
app.get('/core.js', function(req, res) {
    res.sendfile('./public/core.js');
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

app.listen(3000);
console.log("Listening to PORT 3000");


