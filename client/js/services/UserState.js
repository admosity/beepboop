
var module = require('./module');

module.service('UserState', function($state) {
  
  var UserState = (function() {
    UserState.displayName = 'UserState';
    var prototype = UserState.prototype, constructor = UserState;
  
    /**
     * Constructor
     * @param {UserState}
     */
    function UserState() {
      
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


    return UserState;
  })();


  return new UserState();


});