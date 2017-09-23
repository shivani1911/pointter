

var passport = require('passport');
var config  = require('../config/development'); // get db config file
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var User = require('../api/model.js');
var compose = require('composable-middleware');
var validateJwt = expressJwt({secret: config.secret});

function isAuthenticated() {
    return compose()
    // Validate jwt
        .use(function (req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            try {
                validateJwt(req, res, next);

            } catch (e) {
            }
        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.user._id, function (err, user) {
                if (err) return next(err);
                if (!user) {
                    console.log(req.headers.authorization);
                    return res.status(400).send('Unauthorized')
                };
                req.user = user;
                next();
            });
        });
}

function signToken(id, email) {
    return jwt.sign({_id: id, email: email}, config.secret);
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;