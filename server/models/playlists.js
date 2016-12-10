/**
 * Created by Erik on 12/6/16d
 */
var Playlist = require('./mongo').Playlists;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports= {
    show: function (oid, callback) {
        Playlist.find({"_id" : oid}, function(err, playlist) {
            callback(err, playlist);
        });
    },
    showAll: function (callback) {
        Playlist.find(function(err, playlist) {
            callback(err, playlist);
        });
    },
    insertMemo: function (playlist, callback) {
        var newPlaylist = new Playlist(playlist);
        newPlaylist.save(playlist, function(err, document){
            callback(err, document);
        })
    },
    updateMemo: function(oid, update, callback) {
        Playlist.findByIdAndUpdate(oid, update, function (err, numAffected) {
            console.log("Number of playlists updated: ", numAffected);
            callback(err,update);
        });
    },
    deleteMemo: function (oid, callback) {
        Playlist.remove({_id: oid}, (function (err, playlist) {
                callback(err, playlist);
            })
        )
    },
    deleteSong: function (id, path, callback) {
        Playlist.update({"_id" : id}, {$pull: { "songs" : {path:  path}}}, (function (err, playlist) {
                callback(err, playlist);
            })
        )
    }

}