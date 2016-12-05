var fs = require("fs"),
    formidable = require("formidable");
var songs = require("../models/songs")
var crypto = require('crypto');
var S3FS = require('s3fs');


module.exports = {
    showAllMemo: function(req, res, next) {
        songs.show(function (err, rows) {
            if (err) {
                res.status(400).json({error: true, mensaje: "Something went wrong"})
            } else {
                res.status(200).json({error: false, songs: rows});
            }
        });
    },
    setMemo: function (req, res, next) {
        var form = new formidable.IncomingForm();
        console.log(req.headers);
        form.multiples = true;
        form.parse(req, function(error, fields, files) {
            console.log("parsing done");
            console.log(fields);
            //Simulamos una sesión
            /* Possible error on Windows systems:
             tried to rename to an already existing file */
            if (fields.title != null && fields.artist != null) {
                if (files.upload != '' && files.upload != null) {
                    console.log(files);

                    s3fsImpl = new S3FS('omlsongs', {
                        accessKeyId: "AKIAI5L7WWVFEHHOP7CQ",
                        secretAccessKey: "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",
                    });
                    s3fsImpl.create();


                    //guarda en el path único el archivo, en un sistema de ficheros
                    // y esta ruta la guardamos en la BBDD
                    var path = "/files/" + files.upload.name;

                    var file = files.upload;
                    var stream = fs.createReadStream(files.upload.path);
                    s3fsImpl.writeFile(path, stream).then(function () {
                        fs.unlink(file.path, function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                        res.status(200).end();
                    });

                    console.log(path);
                    fs.rename(files.upload.path, "./public/" + path, function (error) {
                        if (error) {
                            console.log("Error");
                            fs.unlink("./public/" + path);
                            fs.rename(files.upload.path, "./public/" + path);

                        } else {
                            var song = {};
                            console.log(path);
                            song.artist = fields.artist;
                            song.title = fields.title;
                            song.path = path;
                            // inserción en la BBDD con ruta del archivo en la BBDD
                            songs.insertMemo(song, function (err, document) {
                                if (err) {
                                    res.status(400).json({error: false, message: "Something went wrong"});
                                } else {
                                    songs.show(function (err, songs) {
                                        res.status(200).json({error: false, songs: songs});
                                    })
                                }
                            })
                        }
                    });
                } else {
                    var song = {};
                    song.artist = fields.artist;
                    song.title = fields.title;
                    // inserción en la BBDD sin ruta del archivo en la BBDD
                    songs.insertMemo(song, function (err, document) {
                        if (err) {
                            res.status(400).json({error: false, message: "Something went wrong"});
                        } else {
                            songs.show(function (err, songs) {
                                res.status(200).json({error: false, songs: songs});
                            })
                        }
                    })
                }
            } else {
                res.status(200).json({error: true, message: "Not able to submit the song"})
            }
        })
        //res.status(200).json({error: true, message: "No se ha podido crear la song"})
    },
    showMemo: function (req, res, next) {
        songs.showMemo(req.params.id, function (err, document) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"})
            } else {
                if (document) {
                    res.status(200).json({error: false, song: document})
                } else {
                    res.status(200).json({error: false, message: "The song with id '" + req.params.id + "' does not exist."})
                }
            }
        })
    },
    deleteMemo: function (req, res, next) {
        songs.deleteMemo(req.params.id, function (err, song) {
            if (err) {
                res.status(400).json({error: false, message: "Something went wrong"});
            } else {
                songs.show(function (err, songs) {
                    res.status(200).json({error: false, songs: songs});
                })
            }
        })
    }
}