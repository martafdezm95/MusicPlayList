/**
 * Created by Erik on 12/6/16.
 */
var fs = require("fs"),
    formidable = require("formidable");
var playlists = require("../models/playlists");
var Playlist = require("../models/mongo").Playlists;
var crypto = require('crypto');
var S3FS = require('s3fs');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({params: {Bucket: 'omlsongs'}});
process.env.AWS_ACCESS_KEY_ID = "AKIAIS3RUJLQVYLPDPAQ";
process.env.AWS_SECRET_ACCESS_KEY = "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";


module.exports = {
    showAllMemo: function(req, res, next) {
        playlists.showAll(function (err, playlists) {
            if (err) {
                res.status(400).json({error: true, mensaje: "Something went wrong"})
            } else {
                res.status(200).json({error: false, playlists: playlists});
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

            if (fields.title != null && fields.artist != null && fields.playlistID != null )
            {
                console.log("playlistID: ", fields.playlistID);
                // If the file is filled in

                if (files.upload != '' && files.upload != null)
                {
                    // where to store the file on S3

                    var path = "files/" + files.upload.name;

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

                            update = {$push : {songs : song}};


                            playlists.updateMemo(fields.playlistID, update, function (err) {
                                if (err) {
                                    res.status(400).json({error: true, message: "Something went wrong"});
                                } else {
                                    playlists.show(fields.playlistID, function (err, playlist) {
                                        res.status(200).json({error: false, playlist: playlist});
                                    })
                                }
                            })
                        }
                    });
                } else {
                    return;
                }
            } else if(fields.playlistName != null)
            {
                //You're creating a new playlist

                var playlist = {};

                playlist.name = fields.playlistName;

                playlists.insertMemo(playlist, function (err, document) {
                    if (err) {
                        res.status(400).json({error: true, message: "Something went wrong"});
                    } else {
                        playlists.show(playlist._id, function (err, playlist) {
                            res.status(200).json({error: false, playlists: playlist});
                        })
                    }
                })

            }
        })

        //res.status(200).json({error: true, message: "No se ha podido crear la song"})
    },
    show: function (req, res, next) {
        playlists.show(req.params.id, function (err, playlist) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"})
            } else {
                if (playlist) {
                    res.status(200).json({error: false, playlist: playlist})
                } else {
                    res.status(200).json({error: false, message: "The playlist with id '" + req.params.id + "' does not exist."})
                }
            }
        })
    },
    deleteMemo: function (req, res) {
        console.log("Deleting Playlist with ID: ", req.params.id);
        playlists.deleteMemo(req.params.id, function (err) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"});
            } else {
                //deleteFileFromS3();
                playlists.showAll(function (err, playlists) {
                    res.status(200).json({error: false, playlists: playlists});
                })
            }
        })
    },
    deleteSong: function (req, res) {
        console.log("Deleting Song with path: ", req.query.path, " and playlistID ", req.params.id);
        playlists.deleteSong(req.params.id, req.query.path, function (err) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"});
            } else {
                //deleteFileFromS3();
                playlists.showAll(function (err, playlists) {
                    res.status(200).json({error: false, playlists: playlists});
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

        console.log("The Write Path: ", writePath);

        var params = {
            Key : writePath,
            Body: data
        }
        s3.upload(params, function(err, data) {
            fs.unlink(readPath, function(err) {
                if(err) {
                    console.error(err);
                }
                console.log("temp file deleted");
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

function getFileFromS3(path)
{
    var params = {
        Bucket: 'omlsongs',
        Key: path
    }
    s3.getObject(params, function(err, data) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(data);
        }
    });

}

