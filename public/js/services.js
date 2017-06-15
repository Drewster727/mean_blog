var app = angular.module('meanBlog.services', []);

app.factory('AuthService', ['$rootScope', '$q', '$timeout', '$http', '$cookieStore',
  function($rootScope, $q, $timeout, $http, $cookieStore) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      var c = $cookieStore.get('user');
      if (c) {
        user = true;
      }

      if (user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/api/user/status')
        // handle success
        .success(function(data) {
          if (data.status) {
            $rootScope.currentUser = data.user;
            user = true;
          } else {
            $rootScope.currentUser = null;
            user = false;
          }
        })
        // handle error
        .error(function(data) {
          user = false;
        });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/user/login', {
          username: username,
          password: password
        })
        // handle success
        .success(function(data, status) {
          if (status === 200 && data.status) {
            user = true;
            $rootScope.currentUser = data.user;

            var today = new Date();
            var expired = new Date(today);
            expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
            $cookieStore.put("user", data.user, {
              expires: expired
            });

            deferred.resolve();
          } else {
            user = false;
            $rootScope.currentUser = null;
            $cookieStore.remove("user");
            deferred.reject();
          }
        })
        // handle error
        .error(function(data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/user/logout')
        // handle success
        .success(function(data) {
          user = false;
          $rootScope.currentUser = null;
          $cookieStore.remove("user");
          deferred.resolve();
        })
        // handle error
        .error(function(data) {
          user = false;
          $rootScope.currentUser = null;
          $cookieStore.remove("user");
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/user/register', {
          username: username,
          password: password
        })
        // handle success
        .success(function(data, status) {
          if (status === 200 && data.status) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function(data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

  }
]).factory('PostService', ['$http', function($http) {

  return {

    // call to GET all posts
    get: function() {
      return $http.get('/api/post', {
        params: {
          ttl: 30000
        }
      });
    },

    getById: function(id) {
      return $http.get('/api/post/' + id, {
        params: {
          ttl: 30000
        }
      });
    },

    getByTag: function(tag) {
      return $http.get('/api/post/tag/' + tag, {
        params: {
          ttl: 30000
        }
      });
    },

    vote: function(id, user, vote) {
      return $http.post('/api/post/vote/' + id + '/' + user + '/' + vote);
      // add no cache
    },

    // call to SAVE a post
    save: function(id, postData) {
      return $http.post('/api/post/save/' + id, postData);
    },

    // call to CREATE a post
    create: function(postData) {
      return $http.post('/api/post', postData);
    },

    // call to DELETE a post
    delete: function(id) {
      return $http.delete('/api/post/' + id);
    }

  }

}]).factory('PageService', ['$rootScope', function($rootScope) {
  return {
    setTitle: function(title) {
      $rootScope.title = title;
    },
    setSubTitle: function(title) {
      $rootScope.subtitle = title;
    }
  }
}]);
