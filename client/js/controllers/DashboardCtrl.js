var module = require('./module');
module.controller('DashboardCtrl', function($scope, Device, $mdToast) {
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
        if(data.message){
          if(angular.isObject(device.payload)) angular.copy(data.message, device.payload)
          else device.payload = data.message;
          $mdToast.show(
            $mdToast.simple()
            .content(data.message)
            .position('top right')
            .hideDelay(5000)
          );
        }
        if(data.error){
          $mdToast.show(
            $mdToast.simple()
            .content(data.error)
            .position('top right')
            .hideDelay(5000)
          );
        }
        // device.payload = data.message;
        console.log(data);
        if(!$scope.$$phase) $scope.$apply();
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