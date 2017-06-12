// app/models/post.js

var mongoose = require('mongoose');

module.exports = mongoose.model('post', {
  title: String,
  subtitle: String,
  text: String,
  tags: [],
  votescore: Number,
  voters: [{
    name: String,
    vote: {
      type: Number,
      min: -1,
      max: 1
    }
  }],
  created: {
    type: Date,
    default: Date.now
  },
  createdby: String,
  modified: {
    type: Date,
    default: Date.now
  },
  modifiedby: String
}, 'post');
