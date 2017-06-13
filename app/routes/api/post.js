// app/routes/api.js

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

// load the post model
var post = require('../../models/post');
var router = require('express').Router();

router.get('/:post_id?', function(req, res) {

  var postId = req.params.post_id;
  if (postId) {
    post.findOne({
      _id: req.params.post_id
    }, function(err, posts) {
      if (err)
        res.send(err)
      res.json(posts);
    });
  } else {
    post.find(function(err, posts) {
      if (err)
        res.send(err);
      res.json(posts);
    });
  }
});
router.get('/tag/:tag', function(req, res) {
  post.find({
    tags: {
      "$in": [req.params.tag]
    }
  }, function(err, posts) {
    if (err)
      res.send(err);
    res.json(posts); // return all todos in JSON format
  });
});
router.post('/vote/:post_id/:user/:vote', function(req, res) {
  var voter = {
    name: req.params.user,
    vote: 1
  };

  var query = post.findOne({
    _id: req.params.post_id
  }).exec();

  query.then(function(p) {
    if (req.params.vote > 0) {
      p.votescore++;
      voter.vote = 1;
    } else {
      p.votescore--;
      voter.vote = -1;
    }

    if (p.voters) {
      var evi = p.voters.findIndex(x => x.name.toLowerCase() == req.params.user.toLowerCase());
      var ev = p.voters[evi];
      if (ev) {
        if ((ev.vote + voter.vote) == 0) {
          p.voters.splice(evi, 1);
        } else {
          ev.vote = voter.vote;
        }
      } else {
        p.voters.push(voter);
      }
    }

    return p.save(); // returns a promise
  }).then(function() {
    post.findOne({
      _id: req.params.post_id
    }, function(err, post) {
      if (err)
        res.send(err)
      res.json(post);
    });
  });
});
router.post('/', function(req, res) {
  post.create({
    text: req.body.text,
    done: false
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the posts after you create another
    post.find(function(err, posts) {
      if (err)
        res.send(err)
      res.json(posts);
    });
  });
});
router.delete('/:post_id', function(req, res) {
  post.remove({
    _id: req.params.post_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the posts after you create another
    post.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});

module.exports = router
