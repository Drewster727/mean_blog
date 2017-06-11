// app/models/post.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('post', {
  title: String,
  text: String,
  created: Date,
  createdby: String,
  modified: Date,
  modifiedby: String,
  done: Boolean
});
