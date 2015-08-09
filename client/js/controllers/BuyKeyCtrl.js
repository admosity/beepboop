var module = require('./module');
module.controller('BuyKeyCtrl', function($scope, Device, $state, $http) {
  Device.loadDevices();
  $scope.device = {};
  $http.get('/client_token').then(function(clientId) {
    
    braintree.setup(
      // Replace this with a client token from your server
      clientId.data,
      "dropin", {
        container: "payment-form"
      });
  });
});