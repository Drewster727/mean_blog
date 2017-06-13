// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var database = require('./config/database');
var multer = require('multer');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var hash = require('bcrypt-nodejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var port = process.env.PORT || 8888; // set the port

// configuration ===============================================================
mongoose.connect(database.url, function(err, db) {
  if (!err) {
    console.log("Connected to mongo");
  }
});

// user schema/model
var User = require('./app/models/user.js');

// define middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use('/api/post', require('./app/routes/api/post'));
app.use('/api/user', require('./app/routes/api/user'));

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
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
