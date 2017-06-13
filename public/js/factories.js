var app = angular.module('meanBlog.factories', []);

app.factory('UserFactory', ['$http', function($http) {

  var userFactory = {};

  userFactory.logout = function() {
    return $http.post("/api/logout");
  };

  userFactory.createUser = function(user) {
    return $http.post('/api/user', user);
  };

  function updateUser(userId, user) {
    return $http.put('/api/user/' + userId, user);
  };

  userFactory.deleteUser = function(userId) {
    return $http.delete('/api/user/' + userId);
  };

  userFactory.findAllUsers = function() {
    return $http.get("/api/user");
  };

  userFactory.register = function(user) {
    return $http.post("/api/register", user);
  };

  userFactory.login = function(user) {
    return $http.post("/api/login", user);
  };

  return userFactory;

}]).factory('PostFactory', ['$http', function($http) {

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

    // call to CREATE a post
    create: function(postData) {
      return $http.post('/api/post', postData);
    },

    // call to DELETE a post
    delete: function(id) {
      return $http.delete('/api/post/' + id);
    }

  }

}]).factory('PageFactory', ['$rootScope', function($rootScope) {
  return {
    setTitle: function(title) {
      $rootScope.title = title;
    },
    setSubTitle: function(title) {
      $rootScope.subtitle = title;
    }
  }
}]);
