/**
 * Created by Erik on 12/6/16d
 */
var User = require('./mongo').User;

module.exports= {
    showAllPlaylists: function (id, callback) {
        User.find({"_id" : id}, function(err, user) {
            callback(err, user);
        });
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