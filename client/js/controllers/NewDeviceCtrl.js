var module = require('./module');
module.controller('NewDeviceCtrl', function($scope, Device) {
  $scope.device = {};
  $scope.newDevice = function() {
    Device.newDevice($scope.device)
  };
});