// Require other routes here
module.exports = function(app) {
  // app.use('/sample', require('./sample'));
  app.use('/device', require('./device'));
};