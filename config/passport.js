
module.exports.passport = {

  local: {
    strategy: require('passport-local').Strategy
  },

  linkedin: {
    name: 'Linkedin',
    protocol: 'oauth2',
    strategy: require('passport-linkedin-oauth2').Strategy,
    options: {
      scope: ['r_emailaddress', 'r_basicprofile'],
      state: true
    }
  }

};
