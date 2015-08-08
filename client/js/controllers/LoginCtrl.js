var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, User) {
  $scope.loginForm = {};
  $scope.login = function() {
    User.login(loginForm)
      .then(function() {
        alert('logged in');
      });
  };

  $scope.signup = function() {
    User.signup(signupForm)
      .then(function() {
        alert('signed up');
      })
  }
});