var module = require('./module');
module.controller('DashboardCtrl', function(Device) {
  Device.loadDevices()
  .then(function(devices) {
    var channels = [];
    devices.forEach(function(device) {
      var key = "device_" + device.readKey;
      var channel = pusher.subscribe(key);
      channels.push(channel);
      var updatePusher = function(data) {
        device.payload = data.message;
      }
      channel.bind('update', updatePusher);

    });

    $scope.$on('$destroy', function () {
      channels.forEach(function(channel) {
        channel.unbind('update', updatePusher);
      })
    });
  })
});