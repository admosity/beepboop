var module = require('./module');

module.controller('LoginCtrl', function($scope, $state, User, $mdDialog, $animate) {
  $scope.loginForm = {};
  $scope.login = function(ev) {
    User.login($scope.loginForm)
      .then(function() {
      })
      .catch(function() {
        $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Could not log in')
                .content('Check your email and password and try again')
                .ok('Alrighty I\'ll try again')
                .targetEvent(ev)
            );
      });
      
  };

  $scope.signupForm = {};
  $scope.signup = function(ev) {
    User.signup($scope.signupForm)
      .catch(function() {
        $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Could not sign up')
                .content('Probably someone else signed up before you, or something really broke. Sorry :(.')
                .ok('Alrighty I\'ll try again')
                .targetEvent(ev)
            );
      })
  }
});