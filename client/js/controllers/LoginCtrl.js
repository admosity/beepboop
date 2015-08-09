var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, User) {
  $scope.loginForm = {};
  $scope.login = function() {
    User.login($scope.loginForm);
  };

  $scope.signupForm = {};
  $scope.signup = function() {
    User.signup($scope.signupForm);
  }
});