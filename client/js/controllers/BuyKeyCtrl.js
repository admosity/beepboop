var module = require('./module');
module.controller('BuyKeyCtrl', function($scope, User, $state) {
  $scope.buyKeys = function() {
    User.buykeys($scope.ccData).then(function(ccData){
      // $state.go('thank-you');
      console.log(ccData);
    });
  };
});