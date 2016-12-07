var Song = require('./mongo').Songs;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports= {
    show: function (callback) {
        Song.find({}, function(err, song) {
            callback(err, song);
        });
    },
    insertMemo: function (song, callback) {
        var newSong = new Song(song);
        newSong.save(song, function(err, document){
            callback(err, document);
        })
    },
    showMemo: function (oid, callback) {
        Song.findById(oid, function(err, song) {
            callback(err, song);
        });
    },
    deleteMemo: function (oid, callback) {
        Song.remove({_id: oid}, (function (err, song) {
                callback(err, song);
            })
        )
    }
}