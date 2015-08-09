var module = require('./module');
module.controller('DashboardCtrl', function(Device) {
  Device.loadDevices();
});