var module = require('./module');
module.directive('injectD', function($compile) {
  return {
    template: '<div></div>',
    link: function(scope, elem, attrs) {
      // elem.append(scope.d.template);
      elem.append(scope.d.template);
      $compile(elem.contents())(scope);
      scope.toNumber = function(val) {
        return Number(val);
      };
    }
  }
})