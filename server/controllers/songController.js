var fs = require("fs"),
    formidable = require("formidable");
var songs = require("../models/songs")
var Song = require("../models/mongo").Songs;
var crypto = require('crypto');
var S3FS = require('s3fs');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({params: {Bucket: 'omlsongs'}});
process.env.AWS_ACCESS_KEY_ID = "AKIAIS3RUJLQVYLPDPAQ";
process.env.AWS_SECRET_ACCESS_KEY = "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";


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

        form.multiples = true;
        form.parse(req, function(error, fields, files) {
            console.log("parsing done");
            console.log(fields);

            // If the fields are filled in

            if (fields.title != null && fields.artist != null && fields.playlist._id != null )
            {
                // If the file is filled in

                if (files.upload != '' && files.upload != null)
                {
                    // where to store the file on S3

                    var path = "/files/" + files.upload.name;

                    console.log("path of song in S3: ", path);

                    // get the file from the form

                    var file = files.upload;

                    // Write the file to S3 path

                    writeFileToS3(files.upload.path, path);

                    fs.rename(files.upload.path, "./public/" + path, function (error) {
                        if (error) {
                            console.log("Error");
                            fs.unlink("./public/" + path);
                            fs.rename(files.upload.path, "./public/" + path);

                        } else {
                            // Removes file from local file system

                            fs.unlink("./public/" + path);


                            var song = {};

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

                    // Return, we don't want to add the song if there is no file

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
                    });
                }
            } else {
                res.status(200).json({error: true, message: "Not able to submit the song"})
            }
        })
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
        songs.deleteMemo(req.params.id, function (err) {
            if (err) {
                res.status(400).json({error: false, message: "Something went wrong"});
            } else {
                //deleteFileFromS3();
                songs.show(function (err, songs) {
                    res.status(200).json({error: false, songs: songs});
                })
            }
        })
    }
}
function writeFileToS3(readPath, writePath)
{
    fs.readFile(readPath, function (err, data) {
        if(err)
        {
            throw err;
        }

        var params = {
            Key : writePath,
            Body: data
        }
        s3.upload(params, function(err, data) {
            fs.unlink(readPath, function(err) {
                if(err) {
                    console.error(err);
                }
            });

            if(err) {
                console.log("Error", err);
            }
            else
            {
                console.log('Successfully uploaded data');
            }
        });

    })
}
function deleteFileFromS3(fileName)
{
    console.log("Preparing to delete");
    console.log("filename", fileName);
    var params = {
        Bucket: 'omlsongs',
        Key: fileName,
    }
    s3.deleteObject(params, function(err, data) {
        if (err)
            return console.log(err);
        else
            console.log('success deleting ' + fileName + ' from s3');
    });
}

function getFileFromS3()
{

}

