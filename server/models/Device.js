var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var DeviceSchema = new Schema({
  name:        {type: String, required: true},
  owner:       {type: Schema.Types.ObjectId, ref: 'User'},
  dateCreated: {type: Date, default: Date.now},

  payload:     Schema.Types.Mixed,
  writeKey:    {type: String, unique: true},
  readKey:     {type: String, unique: true},

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
    creds: Schema.Types.Mixed,
  }],

  base:        {type: Boolean, default: false},
  template: {type: String, default: "{{payload | json}}"},
  quantity:    {type: Number, default: 0},
  onMarket:    {type: Boolean, default: false},
  isPublic:    {type: Boolean, default: false},


}, {collection: 'Device', versionKey: false});

////////////////////////
// Class methods for device 
////////////////////////

DeviceSchema.statics.getOnSale = function(cb) {
  return this.model('Device').find({onMarket: true}, function(err, devices) {
    return cb(err, devices);
  });
};

////////////////////////
// Instance methods for device 
////////////////////////

DeviceSchema.methods.createNewDeviceFromProduct = function() {
  var Device = this.model('Device');
  return new Device({
    name: this.name,
    writeKey: shortid.generate(),
    readKey: shortid.generate(),
    filters: this.filters,
    API: this.API,
    dateCreated: this.dateCreated,
  });
};

DeviceSchema.methods.updateDevice = function(properties) {
  for(var k in properties) {
    this[k] = properties[k];
  }
};

mongoose.model('Device', DeviceSchema);
