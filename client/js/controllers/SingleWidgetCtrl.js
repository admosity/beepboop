var module = require('./module');
module.controller('SingleWidgetCtrl', function(Device, $scope, UserState) {
  var pusher = new Pusher('e5e0a876b1c4b665adc6');
  Device.loadDevices()
    .then(function() {
      $scope.device = new Device(UserState.getDevice());
      var device = $scope.device;
      var key = "device_" + device.readKey;
      var channel = pusher.subscribe(key);
      var updatePusher = function(data) {
        angular.copy(data.message, device.payload);
        if(!$scope.$$phase) $scope.$apply();
      };
      channel.bind('update', updatePusher);
      $scope.$on('$destroy', function () {
        channel.unbind('update', updatePusher);
      });
    });
})