// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var database = require('./config/database');
var secret = require('./config/secret');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var path = require('path');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var session = require('client-sessions');
var port = process.env.PORT || 8888; // set the port

// configuration ===============================================================
mongoose.connect(database.url, function(err, db) {
  if (!err) {
    console.log("Connected to mongo");
  }
});

// define middleware
app.use(express.static(__dirname + '/public', {
  etag: false
})); // set the static files location /public/img will be /img for users
app.use(cookieParser(secret.sessionSecret));
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// controllers
var auth = require('./app/routes/api/auth')(passport);
var post = require('./app/routes/api/post')
var user = require('./app/models/user');

// passport
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(session({
  secret: secret.sessionSecret,
  cookieName: 'session'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
app.use('/', auth);
app.use('/api/post', post);
app.get('*', function(req, res) {
  //res.render('/');
  res.sendfile(__dirname + '/public/index.html')
});

// listen (start app with node server.js) ======================================
app.listen(port, function() {
  console.log('Listening on port %d', port);

  if (process.send) {
    process.send('online');
  }
});
console.log("App listening on port : " + port);

exports = module.exports = app;
