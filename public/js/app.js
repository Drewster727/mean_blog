angular.module('meanBlog', []);

angular.module('meanBlog', ['ngRoute', 'angular-linq', 'ui.select', 'ui.tinymce', 'meanBlog.controllers', 'meanBlog.routes', 'meanBlog.services'])
  .filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    }
  }]).factory('cacheInterceptor', ['$cacheFactory', function($cacheFactory) {
    var http_ttl_cache = {};
    return {
      request: function(config) {
        var N;
        if (config.params && config.params.ttl) {
          config.cache = true;
          N = config.params.ttl;
          delete config.params.ttl;
          if (new Date().getTime() - (http_ttl_cache[config.url] || 0) > N) {
            $cacheFactory.get('$http').remove(config.url);
            http_ttl_cache[config.url] = new Date().getTime();
          }
        }
        return config;
      }
    };
  }]);
