
var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/stw6');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = {
    "user" : String,
    "pass" : String
};

var noteSchema = {
    "fecha" : String,
    "texto" : String,
    "fichero": String
};

// create model if not exists.
module.exports.User = mongoose.model('userLogin',userSchema);
module.exports.Notes = mongoose.model('notes',noteSchema)


