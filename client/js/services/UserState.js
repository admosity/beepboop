
var module = require('./module');

module.service('UserState', function($state, $stateParams, $q, $rootScope) {
  
  var UserState = (function() {
    UserState.displayName = 'UserState';
    var prototype = UserState.prototype, constructor = UserState;
  
    /**
     * Constructor
     * @param {UserState}
     */
    function UserState() {
      this.devices = [];
    }

    Object.defineProperties(prototype, {
      user: {
        get: function() {
          return this._user;
        },

        set: function(user) {
          this._user = user;
          $state.go('dashboard');
        }
      }
    });

    prototype.copyOverDevice = function(device) {
      var found = this.devices.map(function(d) {
        return d._id;
      }).indexOf(device._id);

      if(found > -1) {
        this.devices[found] = device;
      }
    }

    prototype.getDevice = function() {
      return this.devices.filter(function(d) {
          return d._id == $stateParams.id;
        })[0];
    };

    prototype.editDevice = function(device) {
      $state.go('edit-device', {id: device._id});
    }

    prototype.addNewDevice = function(device) {
      this.devices.push(device);
    };

    prototype.reset = function() {
      this.devices = [];
      this._user = null;
      this.devicesLoaded = false;
    };

    prototype.logout = function() {
      var self = this;
      this._user.logout()
        .finally(function() {
          $state.go('home');
        });

    };



    return UserState;
  })();


  var _userState = new UserState();


  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    var toName = toState.name;

    // switch(toName) {
    //   case 'edit-device':
    //     UserState.device = UserState.devices.filter(function(d) {
    //       return d._id == toParams.id;
    //     })[0];
    //     break;
    // }
  });

  return new UserState();


});