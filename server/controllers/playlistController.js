var fs = require("fs");
var formidable = require("formidable");
var playlists = require("../models/playlists");
var AWS = require('aws-sdk');
var s3 = new AWS.S3({params: {Bucket: 'omlsongs'}});
//AWS keys
process.env.AWS_ACCESS_KEY_ID = "AKIAIS3RUJLQVYLPDPAQ";
process.env.AWS_SECRET_ACCESS_KEY = "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";


module.exports = {
    getUser: function(req, res) {
        if(req.user != null)
        {
            res.status(200).json({error: false, user: req.user});
        }
        else
        {
            res.status(401).json({error: true, message: "(UNAUTHORIZED: No user is logged in"});
        }
    },
    //
    showAllPlaylists: function(req, res) {
        console.log("The request object: ", req.user);
        playlists.showAllPlaylists(req.params.id, function (err, user) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"})
            } else {
                res.status(200).json({error: false, user: req.user});
            }
        });
    },
    setPlaylist: function (req, res)
    {
        var form = new formidable.IncomingForm();

        var userId = req.query.userId;

        form.multiples = true;
        form.parse(req, function(error, fields, files) {
            console.log("parsing done");
            console.log(fields);

            // If the fields are filled in

            if (fields.title != null && fields.artist != null && fields.playlistID != null )
            {
                console.log("playlistName: ", fields.playlistID);

                // If a file is chosen

                if (files.upload != '' && files.upload != null)
                {
                    // where to store the file on S3

                    var s3path = fields.playlistID + "/" + files.upload.name;

                    // Write the file to S3 path

                    writeFileToS3(files.upload.path, s3path);

                    var song = {};

                    song.artist = fields.artist;
                    song.title = fields.title;
                    song.path = s3path;

                    var condition = {"_id" : userId, "playlists._id" : fields.playlistID};
                    console.log("Playlist ID: ", fields.playlistID);

                    var update = {"$push" : { "playlists.$.songs" : song}};

                    playlists.updateUser(condition, update, function (err) {
                        if (err) {
                            res.status(400).json({error: true, message: "Something went wrong"});
                        } else {
                            playlists.showAllPlaylists(userId, function (err, user) {
                                res.status(200).json({error: false, user: req.user});
                            })
                        }
                    })

                } else {
                    return;
                }
            } else if(fields.playlistName != null)
            {
                //You're creating a new playlist

                var playlist = {};

                playlist.name = fields.playlistName;

                var condition = {_id : userId};

                var update = {$push : {playlists : playlist}};

                playlists.updateUser(condition, update, function (err) {
                    if (err) {
                        res.status(400).json({error: true, message: "Something went wrong"});
                    } else {
                        playlists.showAllPlaylists(userId, function () {
                            res.status(200).json({error: false, user: req.user});
                        })
                    }
                })

            }
        })

        //res.status(200).json({error: true, message: "No se ha podido crear la song"})
    },
    deletePlaylist: function (req, res)
    {
        console.log("Deleting Playlist with Id: ", req.params.id, " from User with ID: ", req.query.userId);

        var condition = {_id : req.query.userId};

        var update = {$pull: { "playlists" : {_id: req.params.id}}};

        playlists.updateUser(condition, update, function (err) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"});
            } else {
                playlists.showAllPlaylists(req.query.userId, function () {
                    res.status(200).json({error: false, user: req.user});
                })
            }
        })
    },
    deleteSong: function (req, res)
    {
        console.log("Deleting Song with path: ", req.query.songPath, " and playlist name ", req.query.playlistID, "From user with id ", req.params.id);

        var condition = {"_id" : req.params.id, "playlists._id" : req.query.playlistID};

        var update = {$pull: { "playlists.$.songs" : {path:  req.query.songPath}}};

        playlists.updateUser(condition, update, function (err) {
            if (err) {
                res.status(400).json({error: true, message: "Something went wrong"});
            } else {
                deleteFileFromS3(req.query.songPath);
                res.status(200).json({error: false, user: req.user});
            }
        })
    }
}


// Amazon S3 Functions

//Add a song in AWS
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

//Remove songs from AWS
function deleteFileFromS3(path)
{
    console.log("Preparing to delete");
    console.log("filename", path);
    var params = {
        Bucket: 'omlsongs',
        Key: path,
    }
    s3.deleteObject(params, function(err) {
        if (err)
            return console.log(err);
        else
            console.log('success deleting ' + path + ' from s3');
    });
}