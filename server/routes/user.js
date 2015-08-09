var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var passport = require('passport');

router.post('/login', passport.authenticate('local'), function(req, res) {
  return res.ok(req.user);
});

router.post('/signup', function(req, res) {
  return User.createUser(req.body.username, req.body.password, function(err, user) {
    if(err) return res.error(500);
    return req.login(user, function(err) {
      if(err) return res.error(500);
      return res.ok(true);
    });
  });
});

router.post('/logout', function(req, res) {
  if(!req.user) return res.ok();
  req.logout();
  return res.ok();
});

module.exports = router;
