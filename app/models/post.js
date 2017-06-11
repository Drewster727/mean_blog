// app/models/post.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('post', {
  title: String,
  subtitle: String,
  text: String,
  created: { type: Date, default: Date.now },
  createdby: String,
  modified: { type: Date, default: Date.now },
  modifiedby: String
}, 'post');
