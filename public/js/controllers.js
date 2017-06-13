var app = angular.module('meanBlog.controllers', []);

app.controller('LoginController', function($scope, $location, UserFactory) {

    $scope.login = login;

    function login(user) {
      if (user)
        UserFactory
        .login(user)
        .then(
          function(response) {
            $rootScope.currentUser = response.data;
            $location.url("/home");
          },
          function(err) {
            $scope.error = err;
          });
    }
  })
  .controller('MainController', function($scope, $routeParams, PageFactory, PostFactory) {
    PageFactory.setTitle('');
    PageFactory.setSubTitle('');

    $scope.posts = [];

    $scope.getPosts = function(sort) {
      $scope.posts = [];
      PostFactory.get().then(function(response) {
        var posts = [];

        switch (sort) {
          case 'popularity':
            var x = 1;
            //posts = response.data.sortBy('votescore');
          case 'title':
            //posts = response.data.sortBy('title');
            //posts = response.data.sort(sortBy('title'));
            posts = sortByAttribute(response.data, 'title')
          case 'created':
            var x = 1;
            //posts = response.data.sortBy('created');
          default:
            posts = response.data;
        }

        $scope.posts = posts;
      });
    };

    $scope.getPostsByTag = function(tag) {
      $scope.posts = [];
      PostFactory.getByTag(tag).then(function(response) {
        $scope.posts = response.data;
      });
    };

    $scope.vote = function(postId, vote) {
      PostFactory.vote(postId, 'drew', vote);
    };

    if ($routeParams.tag) {
      $scope.getPostsByTag($routeParams.tag);
    } else {
      $scope.getPosts();
    }
  })
  .controller('AboutController', function($scope, PageFactory) {
    PageFactory.setTitle('About');
    PageFactory.setSubTitle('No really, what\'s the deal here?');
  })
  .controller('ContactController', function($scope, PageFactory) {
    PageFactory.setTitle('Contact');
    PageFactory.setSubTitle('For the love of god, don\'t spam me!');
  })
  .controller('PostController', function($scope, $routeParams, PageFactory, PostFactory) {
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

function sortByAttribute(array, ...attrs) {
  // generate an array of predicate-objects contains
  // property getter, and descending indicator
  let predicates = attrs.map(pred => {
    let descending = pred.charAt(0) === '-' ? -1 : 1;
    pred = pred.replace(/^-/, '');
    return {
      getter: o => o[pred],
      descend: descending
    };
  });
  // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
  return array.map(item => {
      return {
        src: item,
        compareValues: predicates.map(predicate => predicate.getter(item))
      };
    })
    .sort((o1, o2) => {
      let i = -1,
        result = 0;
      while (++i < predicates.length) {
        if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
        if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
        if (result *= predicates[i].descend) break;
      }
      return result;
    })
    .map(item => item.src);
}
