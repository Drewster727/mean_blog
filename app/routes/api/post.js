// app/routes/api.js

// load the todo model
var post = require('../../models/post');

var router = require('express').Router();

router.get('/:post_id?', function(req, res) {

  var postId = req.params.post_id;
  if (postId) {
    post.findOne({
      _id: req.params.post_id
    }, function(err, posts) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(posts); // return all todos in JSON format
    });
  } else {
    post.find(function(err, posts) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(posts); // return all todos in JSON format
    });
  }
});
router.post('/', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  post.create({
    text: req.body.text,
    done: false
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    post.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });

});
router.delete('/:post_id', function(req, res) {
  post.remove({
    _id: req.params.post_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    post.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});

module.exports = router
