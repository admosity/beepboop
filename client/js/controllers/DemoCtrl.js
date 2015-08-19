var module = require('./module');
module.controller('DemoCtrl', function($scope, $http) {
  $scope.activateLink = function(link) {
    $http.get(link);
  };
  $scope.encode = function(link) {
    return encodeURIComponent(link);
  };
});