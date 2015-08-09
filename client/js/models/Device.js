var module = require('./module');
module.service('Device', function($http, UserState, $q) {
  var Device = (function() {
    Device.displayName = 'Device';
    var prototype = Device.prototype, constructor = Device;
  
    /**
     * Constructor
     * @param {Device}
     */
    function Device(_device) {
      for(var k in _device) {
        this[k] = _device[k];
      }
    }

    var b = '/api/devices/';

    Device.newDevice = function(props) {
      return $http.post(b, props)
        .then(function(data) {
          var device = new Device(data.data);
          UserState.addNewDevice(device);
          return device;
        });
    };

    Device.loadDevices = function() {
      if(UserState.devicesLoaded) return $q.when(UserState.devices);
      UserState.devicesLoaded = true;
      return $http.get(b)
        .then(function(data) {
          var devices = data.data;
          devices = devices.map(function(d) {
            var rtn = new Device(d);
            UserState.addNewDevice(rtn);
            return rtn;
          });
          return devices;
        })
        .catch(function() {
          UserState.devicesLoaded = false;
        });
    };
    return Device;
  })();
  return Device;
});