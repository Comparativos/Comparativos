/**
 * canView
 *
 * @module      :: Policy
 * @description :: Policy that makes sure requesting user has access to desired data (is owner)
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.user) {
  	sails.log.info(req.user)
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};