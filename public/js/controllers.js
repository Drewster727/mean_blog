var app = angular.module('meanBlog.controllers', []);

app.controller('LoginController', function($scope, $location, UserFactory) {

    $scope.login = login;

    function login(user) {
      if (user)
        UserFactory
        .login(user)
        .then(
          function(response) {
            $rootScope.currentUser = response.data;
            $location.url("/home");
          },
          function(err) {
            $scope.error = err;
          });
    }
  })
  .controller('MainController', function($scope, $routeParams, $location, $linq, PageFactory, PostFactory) {
    PageFactory.setTitle('');
    PageFactory.setSubTitle('');

    $scope.posts = [];

    $scope.redirect = function(path) {
      $location.url(path);
    };

    $scope.getPosts = function(sort) {
      $scope.posts = [];
      PostFactory.get().then(function(response) {
        var posts = [];

        switch (sort) {
          case 'popularity':
            posts = $linq.Enumerable().From(response.data)
              .OrderBy(function(x) {
                return x.votescore
              }).ToArray();
            break;
          case 'title':
            posts = $linq.Enumerable().From(response.data)
              .OrderBy(function(x) {
                return x.title
              }).ToArray();
            break;
          case 'created':
            posts = $linq.Enumerable().From(response.data)
              .OrderBy(function(x) {
                return x.created
              }).ToArray();
            break;
          default:
            posts = response.data;
        }

        $scope.posts = posts;
      });
    };

    $scope.getPostsByTag = function(tag) {
      $scope.posts = [];
      PostFactory.getByTag(tag).then(function(response) {
        $scope.posts = response.data;
      });
    };

    $scope.vote = function(postId, vote) {
      PostFactory.vote(postId, 'drew', vote);
    };

    if ($routeParams.tag) {
      $scope.getPostsByTag($routeParams.tag);
    } else {
      $scope.getPosts();
    }
  })
  .controller('AboutController', function($scope, PageFactory) {
    PageFactory.setTitle('About');
    PageFactory.setSubTitle('No really, what\'s the deal here?');
  })
  .controller('ContactController', function($scope, PageFactory) {
    PageFactory.setTitle('Contact');
    PageFactory.setSubTitle('For the love of god, don\'t spam me!');
  })
  .controller('PostController', function($scope, $routeParams, PageFactory, PostFactory) {
    $scope.post = {};

    $scope.getPost = function(id) {
      $scope.post = {};
      PostFactory.getById(id).then(function(response) {

        $scope.post = response.data;
        PageFactory.setTitle($scope.post.title);
        PageFactory.setSubTitle($scope.post.subtitle);

      });
    };

    $scope.getPost($routeParams.postid);
  }).controller('PostEditController', function($scope, $routeParams, PageFactory, PostFactory) {
    $scope.post = {};
    $scope.availableTags = ['test', 'fun', 'funny'];

    $scope.getPost = function(id) {
      $scope.post = {};
      PostFactory.getById(id).then(function(response) {

        $scope.post = response.data;
        //PageFactory.setTitle($scope.post.title);
        //PageFactory.setSubTitle($scope.post.subtitle);

      });
    };

    if ($routeParams.postid)
      $scope.getPost($routeParams.postid);
  });
