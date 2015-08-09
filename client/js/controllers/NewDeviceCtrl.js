var module = require('./module');
module.controller('NewDeviceCtrl', function($scope, Device, $state) {
  Device.loadDevices();
  $scope.device = {};
  $scope.newDevice = function() {
    Device.newDevice($scope.device).then(function(device){
      $state.go('edit-device', {id: device._id});
    });
  };
});