var validator = require('validator');

/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.register = function (req, res, next) {
  var email    = req.param('email')
    , first_name = req.param('first_name')
    , last_name = req.param('last_name')
    , cargo = req.param('cargo')
    , constructora = req.param('constructora')
    , password = req.param('password')
    , password_repeat = req.param('password_repeat')
    , phone = req.param('telefono')
    , idioma = req.session.locale 

  if (!email) {
    req.flash('error', 'Error.Passport.Email.Missing');
    sails.log.info('error', 'Error.Passport.Email.Missing');
    return next(new Error('No email was entered.'));
  }

/*  if (!first_name) {
    req.flash('error', 'Error.Passport.FirstName.Missing');
    return next(new Error('No first_name was entered.'));
  }*/

/*  if (!last_name) {
    req.flash('error', 'Error.Passport.LastName.Missing');
    return next(new Error('No last_name was entered.'));
  }*/

/*  if (!cargo) {
    req.flash('error', 'Error.Passport.Cargo.Missing');
    return next(new Error('No cargo was entered.'));
  }  */

/*  if (!constructora) {
    req.flash('error', 'Error.Passport.Constructora.Missing');
    return next(new Error('No constructora was entered.'));
  }  */

  if (!password) {
    req.flash('error', 'Error.Passport.Password.Missing');
    sails.log.info('error', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  if (!password_repeat) {
    req.flash('error', 'Error.Passport.PasswordRepeat.Missing');
    sails.log.info('error', 'Error.Passport.PasswordRepeat.Missing');
    return next(new Error('No password_repeat was entered.'));
  }

  if (password_repeat!=password) {
    req.flash('error', 'Error.Passport.Password.DontMatch');
    sails.log.info('error', 'Error.Passport.Password.DontMatch');
    return next(new Error('Passwords don\'t match.'));
  }



  User.create({
    first_name : first_name,
    last_name: last_name,
    cargo: cargo ? cargo : 'Jefe de Obra',
    constructora: constructora,
    phone: phone,
    email: email,
    idioma: idioma
  }, function (err, user) {
    if (err) {
      if (err.code === 'E_UNKNOWN') {
        sails.log.info("USER REGISTER ERROR")
        sails.log.info(err)
        req.flash('error','Error.Passport.Email.Exists.')
        return next(new Error('Error.Passport.Email.Exists.'));
      }
      if (err.code === 'E_VALIDATION') {
        if (err.invalidAttributes.email) {
          sails.log.info('error', 'Error.Passport.Email.Exists');
          return next(new Error('Error.Passport.Email.Exists.'));
        } else {
          req.flash('error', 'Error.Passport.User.Exists');
          sails.log.info('error', 'Error.Passport.User.Exists');
          return next(new Error('Error.Passport.User.Exists.'));
        }
      }
      
      return next(err);
    }


    // USER CREADO
    // vamos a loguearlo

    var eventLog  = {
      service: 'auth',
      action: 'create',
      objectName: user.email,
      objectId: user.id,
      subjectName: user.email,
      subjectId: user.id
    }
    EventLogService.log(eventLog);


    Passport.create({
      protocol : 'local'
    , password : password
    , user     : user.id
    }, function (err, passport) {
      if (err) {
        if (err.code === 'E_VALIDATION') {
          req.flash('error', 'Error.Passport.Password.Invalid');
          sails.log.info('error', 'Error.Passport.Password.Invalid');
        }
        
        return user.destroy(function (destroyErr) {
          next(destroyErr || err);
        });
      }

      next(null, user);
    });
  });
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
  var user     = req.user
    , password = req.param('password');

  Passport.findOne({
    protocol : 'local'
  , user     : user.id
  }, function (err, passport) {
    if (err) {
      return next(err);
    }

    if (!passport) {
      Passport.create({
        protocol : 'local'
      , password : password
      , user     : user.id
      }, function (err, passport) {
        next(err, user);
      });
    }
    else {
      next(null, user);
    }
  });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, identifier, password, next) {
  var isEmail = validator.isEmail(identifier)
    , query   = {};

  if (isEmail) {
    query.email = identifier;
  }
  else {
    query.username = identifier;
  }

  User.findOne(query, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (isEmail) {
        req.flash('error', 'Error.Passport.Email.NotFound');
      } else {
        req.flash('error', 'Error.Passport.Username.NotFound');
      }

      return next(null, false);
    }

    Passport.findOne({
      protocol : 'local'
    , user     : user.id
    }, function (err, passport) {
      if (passport) {
        passport.validatePassword(password, function (err, res) {
          if (err) {
            return next(err);
          }

          if (!res) {
            req.flash('error', 'Error.Passport.Password.Wrong');
            return next(null, false);
          } else {
            return next(null, user);
          }
        });
      }
      else {
        req.flash('error', 'Error.Passport.Password.NotSet');
        return next(null, false);
      }
    });
  });
};
