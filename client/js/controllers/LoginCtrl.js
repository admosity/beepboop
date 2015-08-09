var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, User, $mdToast, $animate) {
  $scope.loginForm = {};
  $scope.login = function() {
    User.login($scope.loginForm)
      .then(function() {
        $mdToast.show(
          $mdToast.simple()
          .content('Simple Toast!')
          .position({
            bottom: false,
            top: true,
            left: false,
            right: true
          })
          .hideDelay(3000)
        );
      });
  };

  $scope.signupForm = {};
  $scope.signup = function() {
    User.signup($scope.signupForm);
  }
});