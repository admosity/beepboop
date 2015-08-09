var module = require('./module');
module.controller('EditDeviceCtrl', function($scope, Device, UserState, $mdDialog, $mdToast, $animate) {

  var pusher = new Pusher('e5e0a876b1c4b665adc6');
  
  Device.loadDevices()
    .then(function() {
      $scope.device = new Device(UserState.getDevice());
      var key = "device_" + $scope.device.readKey;
      var channel = pusher.subscribe(key);
      var updatePusher = function(data) {
        // alert(data.message);
        $mdToast.show(
             $mdToast.simple()
               .content($scope.device.name + ':' + data.message)
               .position('top right')
               .hideDelay(5000)
           );
      }
      channel.bind('update', updatePusher);
      $scope.$on('$destroy', function () { 
        channel.unbind('update', updatePusher);
      });
    })

  $scope.updateDevice = function(ev) {
    $scope.device.save()
      .then(function() {
        UserState.copyOverDevice($scope.device);
        $scope.device = new Device(UserState.getDevice());
        $mdToast.show(
             $mdToast.simple()
               .content('Updated!')
               .position('top right')
               .hideDelay(5000)
           );
      })
      .catch(function() {
        $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Could not update device')
                .content('Sorry :(')
                .ok('Alrighty')
                .targetEvent(ev)
            );
      })
  };
})