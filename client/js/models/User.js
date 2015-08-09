
var module = require('./module');

module.service('User', function($http, UserState) {
  var User = (function() {
    User.displayName = 'User';
    var prototype = User.prototype, constructor = User;
  
    /**
     * Constructor
     * @param {User}
     */
    function User(_user) {
      this._user = _user;
      for(var k in _user) {
        this[k] = _user[k];
      }
    }

    var b = '/api/users';

    User.login = function(loginData) {
      var self = this;

      return $http.post(b + '/login', loginData).then(function(data) {
        UserState.user = new User(data.data);
        return UserState.user;
      });
    };

    prototype.logout = function() {
      return $http.post(b + '/logout', {})
        .finally(UserState.reset);
    };

    User.logout = prototype.logout;

    User.signup = function(signupData) {
      return $http.post(b + '/signup', signupData).then(function(data) {
        UserState.user = new User(data.data);
        return UserState.user;
      });
    };


    return User;
  })();
  return User;
})