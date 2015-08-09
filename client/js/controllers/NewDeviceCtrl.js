var module = require('./module');
module.controller('NewDeviceCtrl', function($scope, Device) {
  Device.loadDevices();
  $scope.device = {};
  $scope.newDevice = function() {
    Device.newDevice($scope.device)
  };
});