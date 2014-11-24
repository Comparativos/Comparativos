// api/policies/localize.js
module.exports = function(req, res, next) {
  req.setLocale(req.session.locale);
  next();
};