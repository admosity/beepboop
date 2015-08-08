
require('./init');

module.exports = {
  ensureAuthMiddleware: function(req, res, next) {
    if(!req.user) {
      return res.error(403);
    }
    next();
  }
};