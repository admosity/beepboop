var Router = require('express').Router
  , router = Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , moment = require('moment')
  , shortid = require('shortid')
  , async = require('async');

require('../models/Device');
var Device = mongoose.model('Device');

var Pusher = require('pusher');

//fuck it commit api keys
var pusher = new Pusher({
  appId: '134371',
  key: 'e5e0a876b1c4b665adc6',
  secret: '0e630ad343ec67ab9f11',
  encrypted: true
});
pusher.port = 443;

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
  .delete(loadDeviceMiddleware, function(req, res) {
    console.log(req.user._id);
    console.log(req.device.owner);
    if(req.user._id.toString() == req.device.owner.toString()) {
      req.device.remove(function(err, product) {
        return res.ok();
      });
    } else {
      return res.error(403);
    }
  })
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
    if(user && id){
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
    var deviceCount = 0;
    Device.find({owner: req.user }, function(err, devices){
      var deviceCount = devices? devices.length: 0;
      if(deviceCount < user.maxKeys){
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
        res.error(401, "Too many devices");
      }
    });
  }else{
    res.error("404", "Page not found");
  }
});

////////////////////////
// device facing endpoints
////////////////////////
function generateResolved(payload, str) {
  "use strict";
  var regex = /{{(.*?)}}/g;
  var match;
  while((match = regex.exec(str)) !== null) {
    var matchFound = match[0];
    try {
      var resolvedStr = eval(matchFound).toString();
      str = str.replace(/{{(.*?)}}/, resolvedStr);
    } catch (err) {
      str = str.replace(/{{(.*?)}}/, '');
    }
  }
  return str;
}

function sendTwilio(api, payload, device){
  var client = require('twilio')(api.creds.sid, api.creds.authToken);
  //Send an SMS text message
  var body = generateResolved(payload, api.details.body);
  client.sendMessage({to: api.details.to, from: api.details.from, body: body}, function(err, responseData) {
    if(err){
      sendPusher(device, "error", "Twilio Error: " + err)
    }
  });
}

function sendTweet(api, payload, device){
  var Twitter = require('twitter');
   
  var client = new Twitter({
    consumer_key: api.creds.consumer_key,
    consumer_secret: api.creds.consumer_secret,
    access_token_key: api.creds.access_token_key,
    access_token_secret: api.creds.access_token_secret
  });

  client.post('statuses/update', {status: generateResolved(api.details.tweet)},  function(error, tweet, response){
    // if(error) throw error;
    // console.log(error);
    if(error){
      sendPusher(device, "error", "Twitter Error: " + error[0]['message']);
    }
    // console.log(tweet);  // Tweet body. 
    // console.log(response);  // Raw response object. 
  });
}

function sendSendGrid(api, payload, device){
  var sendgrid  = require('sendgrid')(api.creds.key);
  var subject = generateResolved(payload, api.details.subject);
  var body = generateResolved(payload, api.details.body);
  sendgrid.send({
    to:       api.details.to,
    from:     api.details.from,
    subject:  subject,
    text:     body
  }, function(err, json) {
    if(err){
      sendPusher(device, "error", "Sendgrid Error: " + err);
    }
  });
}

function sendPusher(device, type, message){
  var key = 'device_' + device.readKey;
  var obj = {};
  obj[type] = message;
  pusher.trigger(key, 'update', obj);
}

router.get('/:id/payload', loadDeviceMiddleware, function(req, res) {
  var query = req.query;
  var device = req.device;
  var sendBack = {};
  var needSave = false;
  if(query.write && query.write == req.device.writeKey && query.payload) {
    device.payload = query.payload;
    async.each(device.API, function(a, cb) {
      // DO API action
      try{
        switch(a.name) {
          case 'twilio':
            sendTwilio(a, device.payload, device); 
          case 'twitter':
            sendTweet(a, device.payload, device); 
          case 'sendgrid':
            sendSendGrid(a, device.payload, device); 
        }
      }catch(e){}
      cb();
    });
    
    sendPusher(device, "message", device.payload);

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