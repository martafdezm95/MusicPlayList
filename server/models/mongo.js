
var http = require('http');
var mongoose    =   require("mongoose");
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
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    name: {type: String, require: true},
    surname: {type: String, require: true},
    b_deleted: {type: Boolean, default: false},
};

var songSchema = {
    "artist" : String,
    "title" : String,
    "path": String,
    "file": Buffer
};

// create model if not exists.
module.exports.User = mongoose.model('userLogin',userSchema);
module.exports.Songs = mongoose.model('songs',songSchema)


