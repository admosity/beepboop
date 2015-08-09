var module = require('./module');
module.controller('DashboardCtrl', function($scope, Device) {
  var pusher = new Pusher('e5e0a876b1c4b665adc6');
  
  Device.loadDevices()
  .then(function(devices) {
    var channels = [];
    var pushers = [];
    devices.forEach(function(device) {
      var key = "device_" + device.readKey;
      var channel = pusher.subscribe(key);
      channels.push(channel);
      var updatePusher = function(data) {
        device.payload = data.message;
      };
      pushers.push(updatePusher);
      channel.bind('update', updatePusher);
      (function(updatePusher, channel) {
        
        $scope.$on('$destroy', function () {
          channel.unbind('update', updatePusher);
        });
      })(updatePusher, channel);
    });

    // $scope.$on('$destroy', function () {
    //   channels.forEach(function(channel, idx) {
    //     channel.unbind('update', pushers[idx]);
    //   })
    // });
  })
});