var app = angular.module('meanBlog.controllers', []);

app.controller('BaseController', function($scope, $routeParams, $location, $linq, PageService, PostService) {

    $scope.redirect = function(path) {
      $location.path(path);
    };

})
  .controller('MainController', function($controller, $scope, $routeParams, $location, $linq, PageService, PostService) {
    $controller('BaseController', { $scope: $scope });

    PageService.setTitle('');
    PageService.setSubTitle('');

    $scope.posts = [];

    $scope.getPosts = function(sort) {
      $scope.posts = [];
      PostService.get().then(function(response) {
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
      PostService.getByTag(tag).then(function(response) {
        $scope.posts = response.data;
      });
    };

    $scope.vote = function(postId, vote) {
      PostService.vote(postId, 'drew', vote);
    };

    if ($routeParams.tag) {
      $scope.getPostsByTag($routeParams.tag);
    } else {
      $scope.getPosts();
    }
  })
  .controller('AboutController', function($controller, $scope, PageService) {
    $controller('BaseController', { $scope: $scope });
    PageService.setTitle('About');
    PageService.setSubTitle('No really, what\'s the deal here?');
  })
  .controller('ContactController', function($controller, $scope, PageService) {
    $controller('BaseController', { $scope: $scope });
    PageService.setTitle('Contact');
    PageService.setSubTitle('For the love of god, don\'t spam me!');
  })
  .controller('PostController', function($controller, $scope, $routeParams, PageService, PostService) {
    $controller('BaseController', { $scope: $scope });

    $scope.post = {};

    $scope.getPost = function(id) {
      $scope.post = {};
      PostService.getById(id).then(function(response) {

        $scope.post = response.data;
        PageService.setTitle($scope.post.title);
        PageService.setSubTitle($scope.post.subtitle);

      });
    };

    $scope.getPost($routeParams.postid);
  }).controller('PostEditController', function($controller, $scope, $routeParams, PageService, PostService) {
    $controller('BaseController', { $scope: $scope });

    $scope.post = {};
    $scope.availableTags = ['test', 'fun', 'funny'];

    $scope.getPost = function(id) {
      $scope.post = {};
      PostService.getById(id).then(function(response) {

        $scope.post = response.data;
        //PageService.setTitle($scope.post.title);
        //PageService.setSubTitle($scope.post.subtitle);

      });
    };

    if ($routeParams.postid)
      $scope.getPost($routeParams.postid);
  }).controller('MenuController', function($controller, $rootScope, $scope, $location, AuthService) {
      $controller('BaseController', { $scope: $scope });

      $scope.$watch('$root.currentUser', function() {
        $scope.currentUser = $rootScope.currentUser;
      });

      $scope.logout = function() {

        // call logout from service
        AuthService.logout()
          .then(function() {
            $location.path('/login');
          });

      };

  }).controller('LoginController', function($controller, $scope, $location, AuthService) {
      $controller('BaseController', { $scope: $scope });

      $scope.login = function() {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
          // handle success
          .then(function() {
            $location.path('/');
            $scope.disabled = false;
            $scope.loginForm = {};
          })
          // handle error
          .catch(function() {
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password";
            $scope.disabled = false;
            $scope.loginForm = {};
          });

      };

  }).controller('LogoutController', function($controller, $scope, $location, AuthService) {
      $controller('BaseController', { $scope: $scope });

      $scope.logout = function() {

        // call logout from service
        AuthService.logout()
          .then(function() {
            $location.path('/login');
          });

      };

   }).controller('RegisterController', function($controller, $scope, $location, AuthService) {
      $controller('BaseController', { $scope: $scope });

      $scope.register = function() {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password)
          // handle success
          .then(function() {
            $location.path('/login');
            $scope.disabled = false;
            $scope.registerForm = {};
          })
          // handle error
          .catch(function() {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
          });

      };

  });
