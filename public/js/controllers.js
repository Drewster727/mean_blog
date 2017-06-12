var app = angular.module('meanBlog.controllers', []);

app.controller('MainController', function($scope, PageService, PostFactory) {
  $scope.posts = [];

  $scope.getPosts = function() {
    $scope.posts = [];
    PostFactory.get().then(function(response) {
      $scope.posts = response.data;
    });
  };

  $scope.getPosts();
}).controller('PostController', function($scope, $routeParams, PageService, PostFactory) {
  $scope.post = {};

  $scope.getPost = function(id) {
    $scope.post = {};
    PostFactory.getById(id).then(function(response) {

      $scope.post = response.data;
      PageService.setTitle($scope.post.title);
      PageService.setSubTitle($scope.post.subtitle);

    });
  };

  $scope.getPost($routeParams.postid);
});
