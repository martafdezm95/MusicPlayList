
var http = require('http');
var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://localhost:27017/stw6');

var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/8080';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connecting to: ' + uristring);
    }
});

// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "user" : String,
    "pass" : String
};

var songSchema = {
    "artist" : String,
    "title" : String,
    "file": String
};

// create model if not exists.
module.exports.User = mongoose.model('userLogin',userSchema);
module.exports.Songs = mongoose.model('songs',songSchema)


