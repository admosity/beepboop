var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  name:        {type: String, required: true},
  owner:       {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated: {type: Date, default: Date.now},

  payload:     Schema.Types.Mixed,
  writeKey:    {type: String, unique: true},
  readKey:     {type: String, unique: true},
  callbackUrl: {type: String},

  filters: [{
    _id: false,
    variableA: {type: String},
    variableB: {type: String},
    operator: {type: String},
  }],
  API: [{
    _id: false,
    name: {type:String},
    details: Schema.Types.Mixed,
  }],
}, {collection: 'Device'});

mongoose.model('Device', DeviceSchema);
