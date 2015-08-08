var router = require('express').Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment');

require('../models/Device');
var Device = mongoose.model('Device');

router.get('/', function(req, res){
  res.ok(true);
});

router.post('/', function(req, res){
  var user = req.user;
  var post = req.body;
  if(user && post.device){
    var device = new Device({
      
    });
    // var newPhoto = new Photo({
    //   url: post.url,
    //   owner: user,
    //   voteCount: 0
    // });
    // newPhoto.save(function(err){
    //   if(!err){
    //     res.ok(true);
    //   }else{
    //     res.error(401, "Failed to post photo");
    //   }
    // });
  }else{
    res.error("404", "Page not found");
  }
});

module.exports = router;