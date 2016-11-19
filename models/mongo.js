var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/stw6');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "user" : String,
    "pass" : String
};

var songSchema = {
    "date" : String,
    "text" : String,
    "file": String
};

// create model if not exists.
module.exports.User = mongoose.model('userLogin',userSchema);
module.exports.Song = mongoose.model('song',songSchema)


