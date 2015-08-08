
var module = require('./module');

module.service('User', function($http) {
  var User = (function() {
    User.displayName = 'User';
    var prototype = User.prototype, constructor = User;
  
    /**
     * Constructor
     * @param {User}
     */
    function User(_user) {
      this._user = _user;
      for(var k in user) {
        this[k] = user[k];
      }
    }

    var b = '/api/users';

    this.login = function(loginData) {
      var self = this;

      return $http.post(b + '/login', loginData).then(function(data) {
        return new User(data.data);
      });
    };

    this.signup = function(signupData) {
      return $http.post(b + '/signup', signupData).then(function(data) {
        return new User(data.data);
      });
    }

    return User;
  })();
  return User;
})