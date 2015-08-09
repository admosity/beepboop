
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




  return new UserState();


});