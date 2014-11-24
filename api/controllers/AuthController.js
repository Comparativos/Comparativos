/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {
  /**
   * Render the login page
   *
   * The login form itself is just a simple HTML form:
   *
      <form role="form" action="/auth/local" method="post">
        <input type="text" name="identifier" placeholder="Username or Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
      </form>
   *
   * You could optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!documentation/config.csrf
   *
   * A simple example of automatically listing all available providers in a
   * Handlebars template would look like this:
   *
      {{#each providers}}
        <a href="/auth/{{slug}}" role="button">{{name}}</a>
      {{/each}}
   *
   * @param {Object} req
   * @param {Object} res
   */
  login: function (req, res) {
    var strategies = sails.config.passport
      , providers  = {};

    // Get a list of available providers for use in your templates.
    Object.keys(strategies).forEach(function (key) {
      if (key === 'local') return;

      providers[key] = {
        name : strategies[key].name
      , slug : key
      };
    });
      //sails.log.info(providers)
    // Render the `auth/login.ext` view
    res.view({
      providers : providers
    , errors    : req.flash('error')
    });
  },
  


  
  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
  register: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    passport.endpoint(req, res);
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    passport.callback(req, res, function (err, user) {
      var errMsg = err;
      req.login(user, function (err) {
        // If an error was thrown, redirect the user to the login which should
        // take care of rendering the error messages.
        if (err) {
          if(req.params.action === 'register'){
            sails.log.info('user:register:error', {err: err, msg: errMsg})
            req.flash('errors',['Algo ha ido mal, ¿está segur@ de que este email no está registrado?'])
            res.redirect('/register');
          } else {
            sails.log.info('user:login:error', {err: err, msg: errMsg}) 
            res.redirect('/login');
          }
        }
        // Upon successful login, send the user to the homepage were req.user
        // will available.
        else {

          if(req.params.action === 'register'){
            sails.log.info('user:register:success', {id: req.user.id})
          } else { 
            res.redirect('/login');
            sails.log.info('user:login:success',{id: req.user.id})
          }

          res.redirect('/');
        }
      });
    });
  },

  // CUSTOM PASS RESET

  resetPetition: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  },  

  processReset: function(req, res){
    User.findOne({email:req.body.email}).exec(function(err, user){
      if(user){
        Passport.findOne({user:user.id, protocol:'local'}).exec(function(err, passport){
          PasswordReset.create({passportId:passport.id}).exec(function(err, petition){
            Mail.passwordReset(petition.id, user.email, function(err, data){
              if(err) console.log(err)
            });
            res.view('auth/mailsended.jade')
          })
        })
      } else {
        res.view('auth/resetpetition.jade',{
          errors: ['Email no encontrado. Inténtelo de nuevo.']
        });
      }
    })
  },

  resetForm: function(req,res){
    PasswordReset.findOne({id:req.params.id}).exec(function(err, petition){
      if(!petition){
        res.notFound()
      } else {
        res.view({
          errors: req.flash('error'),
          id: req.params.id
        });         
      }
    })
   
  },

  reset: function(req, res){
      PasswordReset.findOne({id:req.params.id}).exec(function(err, petition){
        if(petition){
          if(req.body.password!=req.body.password2){
            return res.view('auth/resetform.jade',{
              errors: ['Las contraseñas son distintas.'],
              id: petition.id
            })
          }
          Passport.update({id:petition.passportId},{password:req.body.password}).exec(function(err, passport){
            if(passport) {
              res.redirect('/login')

              PasswordReset.destroy({id:req.params.id}).exec(function deleteCB(err){
                if(err) console.log("error destroying pass succesful pass change petition");
              });

            } else {
              return res.view('auth/resetform.jade',{
                errors: ['Las contraseñadebe tener al menos 8 caracteres.'],
                id: petition.id
              })
            }
          });
        } else {
          res.json({ok:false})
        }
      })
  }, 



};

module.exports = AuthController;
