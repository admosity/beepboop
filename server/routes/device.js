var Router = require('express').Router
  , router = Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment')
  , shortid = require('shortid');

require('../models/Device');
var Device = mongoose.model('Device');


function loadDeviceMiddleware(req, res, next) {
  Device.findById(req.params.id, function(err, device) {
    if(!device) {
      return res.error(404);
    } else if(err) {
      return res.error(500);
    }
    req.device = device;
    return next();
  });
}

////////////////////////
// User facing device endpoints 
////////////////////////


// Retrieve devices 
router.get('/', function(req, res){
  return req.user.getDevices(function(err, devices) {
    return res.ok(devices);
  });
});


router
  .route('/:id')
  .get(loadDeviceMiddleware, function(req, res) {
    var id = req.params.id;
    return Device.findOne({_id: id, owner: req.user }, function(err, device) {
      if(!device) {
        return res.error(404);
      } else {
        return res.ok(device);
      }
    })
  })
  .post(loadDeviceMiddleware, function(req, res) {
    var user = req.user;
    var id = req.params.id;
    var post = req.body;
    if(user && id && post.device){
      // update the device 
      Device.findOne({_id: id, owner: req.user }, function(err, device){
        device.updateDevice(post);
        device.save(function(err) {
          if(err) return res.error('500', "Something terrible happpened.")
          return res.ok(device);
        })
      });
    }else{
      res.error("404", "Page not found");
    }
  });

router.post('/', function(req, res){
  var user = req.user;
  var post = req.body;
  if(user && post.name){
    var writeKey = shortid.generate();
    var readKey = shortid.generate();
//http://localhost:5000/api/devices/55c6a8d40270f9eb41d5a875/payload?write=%20VJBx_5ys&payload=123
    var device = new Device({
      owner: user,
      name: post.name,
      writeKey: writeKey,
      readKey: readKey,
      base: true,
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

router.get('/:id/payload', loadDeviceMiddleware, function(req, res) {
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
        return res.ok(rtn);
      });
    } else {
      return res.ok(rtn);
    }
  }else if(needSave){
    return device.save(function(err) {
      return res.ok();
    });
  }

  return res.error(400);

});


module.exports = router;