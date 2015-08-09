var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var passport = require('passport');

router.post('/login', passport.authenticate('local'), function(req, res) {
  return res.ok(user);
});

router.post('/signup', function(req, res) {
  return User.createUser(req.body.username, req.body.password, function(err, user) {
    if(err) return res.error(500);
    return res.ok(true);
  })
});

module.exports = router;
