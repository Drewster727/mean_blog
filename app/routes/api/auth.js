var express = require('express');
var path = require('path');
var router = express.Router();
var isLoggedIn = require('../../middleware/isLoggedIn');
var User = require('../../models/user.js');

module.exports = function(passport) {

  router.post('/api/user/register', function(req, res) {
    User.register(new User({
        username: req.body.username
      }),
      req.body.password,
      function(err, account) {
        if (err) {
          return res.status(500).json({
            err: err
          });
        }
        passport.authenticate('local')(req, res, function() {
          return res.status(200).json({
            status: 'Registration successful!'
          });
        });
      });
  });

  router.post('/api/user/login', function(req, res, next) {
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
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }
        res.status(200).json({
          status: 'Login successful!',
          user: user
        });
      });
    })(req, res, next);
  });

  router.get('/api/user/logout', function(req, res) {
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
  });

  router.get('/api/user/status', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        status: false
      });
    }
    res.status(200).json({
      status: true,
      user: req.user
    });
  });


  return router;
}
