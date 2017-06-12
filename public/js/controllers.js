var app = angular.module('meanBlog.controllers', []);

app.controller('MainController', function($scope, PageFactory, PostFactory) {
  $scope.posts = [];

  $scope.getPosts = function() {
    $scope.posts = [];
    PostFactory.get().then(function(response) {
      $scope.posts = response.data;
    });
  };

  $scope.vote = function(postId, vote) {
    PostFactory.vote(postId, 'drew', vote);
  };

  $scope.getPosts();
}).controller('PostController', function($scope, $routeParams, PageFactory, PostFactory) {
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
});
