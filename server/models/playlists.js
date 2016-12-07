/**
 * Created by Erik on 12/6/16.
 */
var Playlist = require('./mongo').Playlists;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports= {
    show: function (callback) {
        Playlist.find({}, function(err, playlist) {
            callback(err, playlist);
        });
    },
    insertMemo: function (playlist, callback) {
        var newPlaylist = new Playlist(playlist);
        newPlaylist.save(playlist, function(err, document){
            callback(err, document);
        })
    },
    showMemo: function (oid, callback) {
        Playlist.findById(oid, function(err, playlist) {
            callback(err, playlist);
        });
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
    }
}