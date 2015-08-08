var Router = require('express').Router
  , router = Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment')
  , shortid = require('shortid');

require('../models/Device');
var Device = mongoose.model('Device');

////////////////////////
// User facing device endpoints 
////////////////////////

router.use('/:id', function(req, res, next) {
  Device.findById(req.params.id, function(err, device) {
    if(!device) {
      return res.error(404);
    } else if(err) {
      return res.error(500);
    }
    req.device = device;
    return next();
  });
});

// Retrieve devices 
router.get('/', function(req, res){
  return req.user.getDevices(function(err, devices) {
    return res.ok(devices);
  });
});

// binded to /:id
var deviceIdRouter = Router();

deviceIdRouter
  .route('/')
  .get(function(req, res) {
    var id = req.params.id;
    return Device.findOne({_id: id, owner: req.user }, function(err, device) {
      if(!device) {
        return res.error(404);
      } else {
        return res.ok(device);
      }
    })
  })
  .post(function(req, res) {
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
    var writeKey = shortid.generate();
    var readKey = shortid.generate();

    var device = new Device({
      owner: user,
      name: post.name,
      writeKey: writeKey,
      readKey: readKey,
    });
    device.save(function(err){
      if(!err){
        res.ok(device);
      }else{
        res.error(401, "Failed to create device");
      }
    });
  }else{
    res.error("404", "Page not found");
  }
});

////////////////////////
// device facing endpoints
////////////////////////

router.get('/:id/payload', function(req, res) {
  var query = req.query;
  var device = req.device;
  var sendBack = {};
  var needSave = false;
  if(query.write && query.write == req.device.writeKey && query.payload) {
    device.payload = query.payload;
    needSave = true;
  }

  if(query.read && query.read == device.readKey) {
    var rtn = {
      payload: device.payload,
      action: device.action,
    };
    if(needSave) {
      return device.save(function(err) {
        return res.ok(action);
      });
    } else {
      return res.ok(action);
    }
  }

  return res.error(400);

});

router.use('/:id', deviceIdRouter);

module.exports = router;