var router = require('express').Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment');

require('../models/Device');
var Device = mongoose.model('Device');

router.get('/', function(req, res){
  res.ok(true);
});

router.post('/:id', function(req, res){
  var user = req.user;
  var id = req.params.id;
  var post = req.body;
  if(user && id && post.device){
    Device.findById(id, function(err, device){
      console.log("beep", device);
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

router.post('/', function(req, res){
  var user = req.user;
  var post = req.body;
  if(user && post.device){
    var writeKey = "asdf";
    var readKey = "asdf";

    var device = new Device({
      owner: user,
      writeKey: writeKey,
      readKey: readKey,
    });
    device.save(function(err){
      if(!err){
        res.ok(true);
      }else{
        res.error(401, "Failed to post photo");
      }
    });
  }else{
    res.error("404", "Page not found");
  }
});

module.exports = router;