//Request for authentication management
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/mongo').User;

//Register user
router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username }),
        req.body.password, function(err, account) {
            if (err) {
                return res.status(400).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});

//Sign in
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(400).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                user: user,
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});

//Log out
router.get('/logout', function(req, res) {
    req.logout();
    console.log("OUT!")
    res.status(200).json({
        status: 'Bye!'
    });
});

//Returns the status of the user
router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }

    res.status(200).json({
        status: true
    });
});

module.exports = router;