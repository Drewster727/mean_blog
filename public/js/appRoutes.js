angular.module('meanBlog.routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    // home page
    .when('/', {
      templateUrl: 'views/posts.html',
      controller: 'MainController'
    })

    // post view page
    .when('/post/:postid', {
      templateUrl: '/views/post.html',
      controller: 'PostController'
    })

    .otherwise({
      redirectTo: '/'
    });

  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

}]);
