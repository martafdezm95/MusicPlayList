/**
 * Autor: Alejandro Solanas Bonilla
 * NIA: 647647
 * Fichero: mongo.js
 * Fecha: 29/5/2016
 * Funcion: Modelo de usuarios y notas de mongodb y conector de mongoose
 */

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


