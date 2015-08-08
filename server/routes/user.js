var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');

router.post('/login', passport.authenticate('local'), function(req, res) {
  return res.ok(user);
});

module.exports = router;
