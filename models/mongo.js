
var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://localhost:27017/stw6');

var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/8080';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connectingç to: ' + uristring);
    }
});


// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "user" : String,
    "pass" : String
};

var noteSchema = {
    "artist" : String,
    "title" : String,
    "file": String
};

var playlistSchema = {
    noteSquema : {}
};

// create model if not exists.
module.exports.User = mongoose.model('userLogin',userSchema);
module.exports.Playlist = mongoose.model('playlist',playlistSchema);
module.exports.Notes = mongoose.model('notes',noteSchema)


