var router = require('express').Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment')
  , shortid = require('shortid');

require('../models/Device');
var Device = mongoose.model('Device');

router.get('/', function(req, res){
  res.ok(true);
});

router.get('/:id', function(req, res){
  var id = req.params.id;
  if(id){
    Device.findOne({readKey: id}, function(err, device){
      if(!err && device){
        console.log("beep", device);
        res.ok(device.data);
      }else{
        res.error("404", "Not found");
      }
    });
  }
});

router.post('/:id', function(req, res){
  var user = req.user;
  var id = req.params.id;
  var post = req.body;
  if(user && id && post.device){
    Device.findById(id, function(err, device){
      console.log("beep", device);
      //save and shit here
    });
  }else{
    res.error("404", "Page not found");
  }
});

router.post('/', function(req, res){
  var user = req.user;
  var post = req.body;
  if(user && post.device){
    var writeKey = shortid.generate();
    var readKey = shortid.generate();

    var device = new Device({
      // owner: user,
      name: "asdf",
      writeKey: writeKey,
      readKey: readKey,
    });
    device.save(function(err){
      if(!err){
        res.ok(true);
      }else{
        res.error(401, "Failed to create device");
      }
    });
  }else{
    res.error("404", "Page not found");
  }
});

module.exports = router;