'use strict';

// Load dependencies
var User = require('mongoose').model('User'),
    passport = require('passport');

// Error manager
var getErrorMessage = function(err) {
    var message = '';

    // Error in mongoDB
    if (err.code) {
        switch (err.code) {
            // Unique index error
            case 11000:
            case 11001:
                message = 'User already exists';
                break;
            //general error
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};

//Singin page
exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

// signup
exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

// creating new users
exports.signup = function(req, res, next) {
    // user not connected, create and login user
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

// Create users'OAuth'
exports.saveOAuthUserProfile = function(req, profile, done) {
    // Prueba a encontrar un documento user que fue registrado usando el actual provider OAuth
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function(err, user) {
        // Si ha ocurrido un error continua al siguiente middleware
        if (err) {
            return done(err);
        } else {
            // Si un usuario no ha podido ser encontrado, crea un nueo user, en otro caso, continua al siguiente middleware
            if (!user) {
                // Configura un posible username base username
                var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

                // Encuentra un username único disponible
                User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                    // Configura el nombre de usuario disponible
                    profile.username = availableUsername;

                    // Crear el user
                    user = new User(profile);

                    // Intenta salvar el nuevo documento user
                    user.save(function(err) {
                        // Continúa al siguiente middleware
                        return done(err, user);
                    });
                });
            } else {
                // Continúa al siguiente middleware
                return done(err, user);
            }
        }
    });
};

// Sign out
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};