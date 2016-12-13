/**
 * Created by Erik on 12/6/16d
 */
var User = require('./mongo').User;
var Playlist = require('./mongo').Playlist;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports= {
    showAllPlaylists: function (id, callback) {
        User.find({"_id" : id}, function(err, user) {
            callback(err, user);
        });
    },
    insertPlaylist: function (id, update, callback) {
        User.findByIdAndUpdate(id, update, function(err, document){
            callback(err, document);
        })
    },
    updateUser: function(condition, update, callback) {
        User.update(condition, update, function (err, user) {
            callback(err,user);
        });
    },
    deletePlaylist: function (id, update, callback) {
        User.findByIdAndUpdate(id, update, (function (err, user) {
                callback(err, user);
            })
        )
    },
    deleteSong: function (id, update, callback) {
        User.findByIdAndUpdate(id, update, (function (err, user) {
                callback(err, user);
            })
        )
    }

}