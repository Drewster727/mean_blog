var app = angular.module('meanBlog.controllers', []);

app.controller('BaseController', function($rootScope, $scope, $routeParams, $location, $linq, PageService, PostService) {

    $scope.redirect = function(path) {
      $location.path(path);
    };

    $scope.owned = function(user) {
      var cu = $rootScope.currentUser;
      if (cu && user && cu.username.toLowerCase() == user.toLowerCase())
        return true;

      return false;
    };

    $scope.voted = function(post, vote) {
      var cu = $rootScope.currentUser;
      if (cu && post && post.tags && post.tags.length > 0) {
        for (var i = 0; i < post.voters.length; i++) {
          var v = post.voters[i];
          if (v.name.toLowerCase() == cu.username.toLowerCase() && v.vote == vote) {
            return true;
          }
        }
      }
      return false;
    };

    $scope.updatePost = function(post) {
      post['owned'] = $scope.owned(post.createdby);
      return post;
    }

  })
  .controller('MainController', function($controller, $scope, $routeParams, $location, $linq, PageService, PostService) {
    $controller('BaseController', {
      $scope: $scope
    });

    PageService.setTitle('');
    PageService.setSubTitle('');

    $scope.posts = [];

    $scope.deletePost = function(id) {
      PostService.delete(id).then(function() {
        $scope.getPosts();
      });
    };

    $scope.getPosts = function(sort) {
      $scope.posts = [];
      PostService.get().then(function(response) {
        var posts = [];

        switch (sort) {
          case 'popularity':
            posts = $linq.Enumerable().From(response.data)
              .OrderByDescending(function(x) {
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
              .OrderByDescending(function(x) {
                return x.created
              }).ToArray();
            break;
          default:
            posts = response.data;
        }

        for (var i = 0; i < posts.length; i++) {
          var p = posts[i];
          p['owned'] = $scope.owned(p.createdby);
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
      PostService.vote(postId, 'drew', vote).then(function(r) {
        var updated = r.data;
        for (var i = 0; i < $scope.posts.length; i++) {
          if ($scope.posts[i]._id == updated._id) {
            $scope.posts[i] = $scope.updatePost(updated);
          }
        }
      });
    };

    if ($routeParams.tag) {
      $scope.getPostsByTag($routeParams.tag);
    } else {
      $scope.getPosts();
    }
  })
  .controller('AboutController', function($controller, $scope, PageService) {
    $controller('BaseController', {
      $scope: $scope
    });
    PageService.setTitle('About');
    PageService.setSubTitle('No really, what\'s the deal here?');
  })
  .controller('ContactController', function($controller, $scope, PageService) {
    $controller('BaseController', {
      $scope: $scope
    });
    PageService.setTitle('Contact');
    PageService.setSubTitle('For the love of god, don\'t spam me!');
  })
  .controller('PostController', function($controller, $scope, $routeParams, $location, PageService, PostService) {
    $controller('BaseController', {
      $scope: $scope
    });

    $scope.post = {};

    $scope.deletePost = function(id) {
      PostService.delete(id).then(function() {
        $location.path('/');
      });
    };

    $scope.getPost = function(id) {
      $scope.post = {};
      PostService.getById(id).then(function(response) {

        $scope.post = response.data;
        $scope.post['owned'] = $scope.owned($scope.post.createdby);
        PageService.setTitle($scope.post.title);
        PageService.setSubTitle($scope.post.subtitle);

      });
    };

    $scope.vote = function(postId, vote) {
      PostService.vote(postId, 'drew', vote).then(function(r) {
        $scope.post = r.data;
      });
    };

    $scope.getPost($routeParams.postid);
  }).controller('PostEditController', function($controller, $location, $scope, $routeParams, PageService, PostService) {
    $controller('BaseController', {
      $scope: $scope
    });

    $scope.post = {};
    $scope.availableTags = ['test', 'fun', 'funny'];

    $scope.submit = function() {
      $scope.post = $scope.post;
      if ($scope.post._id) {
        PostService.save($scope.post._id, $scope.post);
      } else {
        PostService.create($scope.post).then(function() {
          $location.path('/');
        });
      }
      PageService.setTitle($scope.post.title);
      PageService.setSubTitle($scope.post.subtitle);
    };

    $scope.getPost = function(id) {
      $scope.post = {};
      PostService.getById(id).then(function(response) {

        $scope.post = response.data;
        PageService.setTitle($scope.post.title);
        PageService.setSubTitle($scope.post.subtitle);

      });
    };

    if ($routeParams.postid)
      $scope.getPost($routeParams.postid);
  }).controller('MenuController', function($controller, $rootScope, $scope, $location, AuthService) {
    $controller('BaseController', {
      $scope: $scope
    });

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
    $controller('BaseController', {
      $scope: $scope
    });

    AuthService.logout();

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
    $controller('BaseController', {
      $scope: $scope
    });

    $scope.logout = function() {

      // call logout from service
      AuthService.logout()
        .then(function() {
          $location.path('/login');
        });

    };

  }).controller('RegisterController', function($controller, $scope, $location, AuthService) {
    $controller('BaseController', {
      $scope: $scope
    });

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
