// app/routes.js

// the prefix
var routePreFix = '/api/blog';

// load the todo model
var post = require('./models/post');

// expose the routes to our app with module.exports
module.exports = function(app) {

  // api ---------------------------------------------------------------------
  // get all todos
  app.get(routePreFix, function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(todos); // return all todos in JSON format
    });
  });

  // create todo and send back all todos after creation
  app.post(routePreFix, function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    post.create({
      text: req.body.text,
      done: false
    }, function(err, todo) {
      if (err)
        res.send(err);

      // get and return all the todos after you create another
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });

  });

  // delete a todo
  app.delete(routePreFix + '/:todo_id', function(req, res) {
    post.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err)
        res.send(err);

      // get and return all the todos after you create another
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });
};
