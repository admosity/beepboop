var module = require('./module');
module.controller('BuyKeyCtrl', function($scope, User, $state, $http) {
  $scope.buyKeys = function() {
    User.buykeys($scope.ccData).then(function(ccData){
      // $state.go('thank-you');
      console.log(ccData);
    });
  };
  $http.get('/client_token').then(function(clientId) {
    
    braintree.setup(
      // Replace this with a client token from your server
      clientId.data,
      "dropin", {
        container: "payment-form"
      });
  });
});