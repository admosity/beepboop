var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  owner:       {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated: {type: Date, default: Date.now},
  data:        {},
  callbackUrl: {type: String},
  filters: [{
    _id: false,
    variableA: {type: String},
    variableB: {type: String},
    operator: {type: String},
  }],
  API: [{
    _id: false,
    type: {type:String},
    details: {},
  }],
}, {collection: 'Device'});

mongoose.model('Device', DeviceSchema);
