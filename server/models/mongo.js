
var http = require('http');
var mongoose    =   require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
//mongoose.connect('mongodb://localhost:27017/stw6');

var uristring = process.env.MONGOLAB_URI || 'mongodb://root:root@ds159527.mlab.com:59527/onlinemusiclibrary';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connecting to: ' + uristring);
    }
});

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var User  = Schema({
    username: String,
    password: String
});
User.plugin(passportLocalMongoose);

var songSchema = {
    "artist" : String,
    "title" : String,
    "path": String,
    "file": Buffer
};

// create model if not exists.
module.exports.User = mongoose.model('users',User);
module.exports.Songs = mongoose.model('songs',songSchema);