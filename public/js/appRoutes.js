angular.module('meanBlog.routes', []).config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {

  $routeProvider

    // home page
    .when('/', {
      templateUrl: 'views/posts.html',
      controller: 'MainController',
      resolve: {
        loggedin: checkCurrentUser
      }
    })

    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutController',
      resolve: {
        loggedin: checkCurrentUser
      }
    })

    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactController',
      resolve: {
        loggedin: checkCurrentUser
      }
    })

    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      controllerAs: 'model'
    })

    .when('/tags/:tag', {
      templateUrl: 'views/posts.html',
      controller: 'MainController',
      resolve: {
        loggedin: checkCurrentUser
      }
    })

    // post view page
    .when('/post/:postid', {
      templateUrl: '/views/post.html',
      controller: 'PostController',
      resolve: {
        loggedin: checkCurrentUser
      }
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

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/api/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    // User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
      deferred.resolve();
    }
    // User is Not Authenticated
    else {
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }
  });

  return deferred.promise;
};

var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/api/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    // User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
    }
    deferred.resolve();
  });

  return deferred.promise;
};
