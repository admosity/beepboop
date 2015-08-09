var module = require('./module');
module.service('Device', function($http, UserState, $q, $compile, $sce) {
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
        if(k == 'writeKey') {
          this.payloadUrl = window.location.protocol + '//' + window.location.hostname + '/api/devices/' + _device._id + '/payload?write=' + this[k] + '&payload=Hello%20World';
        }
        if(k == 'readKey') {
          this.endpointUrl = window.location.protocol + '//' + window.location.hostname + '/api/devices/' + _device._id + '/payload?read=' + this[k];
        }

      }

      // if(!(_device instanceof Device)) {
      //   this.template = $sce.trustAsHtml(this.template);
      // }
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

    prototype.save = function() {
      return $http.post(b + this._id, this)
        .then(function(data) {
          return data.data;
        });
    };

    prototype.remove = function() {
      var self = this;
      return $http.delete(b + this._id)
        .then(function() {
          UserState.removeDevice(self);
          return self;
        });
    };

    return Device;
  })();
  return Device;
});