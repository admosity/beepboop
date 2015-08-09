var module = require('./module');
module.service('Device', function($http, UserState) {
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
    return Device;
  })();
  return Device;
});