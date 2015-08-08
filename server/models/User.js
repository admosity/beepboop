// Mongoose 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// bcrypt 
var bcrypt = require('bcrypt');

var User = new Schema({ 
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, {collection: 'User'});

// User.methods.validPassword(function(password, callback) {
//   bcrypt.compare(password, this.password, function(err, res) {
//     if(res) {
//       callback(null, this);
//     } else {
//       callback(true, this);
//     }
//   });
// })

mongoose.model('User', User);