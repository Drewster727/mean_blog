var app = angular.module('meanBlog.factories', []);

app.factory('PostFactory', ['$http', function($http) {

  return {

    // call to GET all posts
    get: function() {
      return $http.get('/api/blog/post', {
        params: {
          ttl: 30000
        }
      });
    },

    getById: function(id) {
      return $http.get('/api/blog/post/' + id, {
        params: {
          ttl: 30000
        }
      });
    },

    // call to CREATE a post
    create: function(postData) {
      return $http.post('/api/blog/post', postData);
    },

    // call to DELETE a post
    delete: function(id) {
      return $http.delete('/api/blog/post/' + id);
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
