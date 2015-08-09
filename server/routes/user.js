var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var passport = require('passport');

var util = require('util');
var braintree = require('braintree');

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

//YOLO FUCK IT
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '23dqvgbhs484bh76',
  publicKey: '2nftbpkv9w83hzqt',
  privateKey: 'f806b1a45a7d14aff57df46a1eacbf62'
});

router.post('/buykeys', function(req, res) {
  if(req.user){
    var post = req.body;
    gateway.transaction.sale({
      amount: '2.00',
      creditCard: {
        number: post.creditCard,
        expirationDate: post.expirationDate
      }
    }, function (err, result) {
      if (err) throw err;
     
      if (result.success) {
        // util.log('Transaction ID: ' + result.transaction.id);
        req.user.maxKeys += 10;
        req.user.save(function(err){
          res.ok(true);
        });
      } else {
        res.error(500, result.message);
      }
    });
  }
});

module.exports = router;
