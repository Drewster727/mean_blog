angular.module('meanBlog.routes', []).config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {

  $routeProvider

    // home page
    .when('/', {
      templateUrl: 'views/posts.html',
      controller: 'MainController',
      access: {
        restricted: true
      }
    })

    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      access: {
        restricted: false
      }
    })

    .when('/logout', {
      controller: 'LogoutController',
      access: {
        restricted: true
      }
    })

    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterController',
      access: {
        restricted: false
      }
    })

    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutController',
      access: {
        restricted: false
      }
    })

    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactController',
      access: {
        restricted: true
      }
    })

    .when('/tags/:tag', {
      templateUrl: 'views/posts.html',
      controller: 'MainController',
      access: {
        restricted: true
      }
    })

    // post view page
    .when('/post/:postid', {
      templateUrl: '/views/post.html',
      controller: 'PostController',
      access: {
        restricted: true
      }
    })

    .when('/postedit/:postid?', {
      templateUrl: '/views/postedit.html',
      controller: 'PostEditController',
      access: {
        restricted: true
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

}]).run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function(event, next, current) {
      if (next.access.restricted && !AuthService.isLoggedIn()) {
        $location.path('/login');
      }
      // AuthService.getUserStatus()
      //   .then(function() {
      //     if (next.access.restricted && !AuthService.isLoggedIn()) {
      //       $location.path('/login');
      //       $route.reload();
      //     }
      //   });
    });
});
