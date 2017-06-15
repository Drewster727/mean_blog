var app = angular.module('meanBlog.directives', []);

app.directive('ngConfirmClick', function() {
  return {
    priority: 1,
    terminal: true,
    link: function(scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click', function() {
        if (window.confirm(msg)) {
          scope.$eval(clickAction)
        }
      });
    }
  };
});
