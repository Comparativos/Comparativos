/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */


var STATIC_ASSET_REGEX = /\..*/;
var routingTable = {
  '/home':true,
  '/obras':true,
  '/obras/:id':true,
  '/obras/new':true,
  '/comparativos':true,
  '/comparativos/new':true,
  '/comparativos/:id':true,
  '/tabla/:id':true,
  '/profile':true
};
 



module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'HomeController',
  '/es': 'HomeController.es',
  '/eu': 'HomeController.eu',
  'get /politicas': 'HomeController.politicas',
  'get /preguntas': 'HomeController.preguntas',
  
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',
  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',
  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/:action': 'AuthController.callback',
    // custom pass reset 
  'get /resetpass': 'AuthController.resetPetition',
  'post /auth/reset/process': 'AuthController.processReset',
  'get /resetpass/:id': 'AuthController.resetForm',  
  'post /auth/reset/:id': 'AuthController.reset',

  // Custom routes here...

    /**
     * User routes
     */
    // 'get /api/user': 'UserController.getAll',
    // 'get /api/user/:id': 'UserController.getOne',
    // 'post /api/user': 'UserController.create',
    'put /api/user': 'UserController.update',
  /**
     * OBRA routes
     *
     */
    'get /api/obra': 'ObraController.getAll',
    'get /api/obra/:id': 'ObraController.getOne',
    'post /api/obra': 'ObraController.create',
    'post /api/obra/archive/:id': 'ObraController.archive',
    'delete /api/obra/:id': 'ObraController.destroy',


  /**
     * COMPARATIVO routes
     *
     */
    'get /api/comparativo': 'ComparativoController.getAll',
    'get /api/comparativo/:id': 'ComparativoController.getOne',
    'post /api/comparativo': 'ComparativoController.create',
    'put /api/comparativo/:id': 'ComparativoController.update',
    'delete /api/comparativo/:id': 'ComparativoController.destroy',




  /**
     * PETICION routes
     *
     */
    //'get /api/peticion': 'PeticionController.getAll',
    'get /api/peticion/:id': 'PeticionController.getOne',
    'post /api/peticion': 'PeticionController.create',
    'post /api/peticion/send': 'PeticionController.send',
    'delete /api/peticion/:id': 'PeticionController.destroy',


    // RESPUESTA routes
  //'get /api/respuesta': 'RespuestaController.getAll',

    // FORM routes

  'get /form/:id': 'FormController.index',
  'get /form/:id/eu': 'FormController.index_eu',
  'post /form/submit/:id': 'FormController.submit',
  'post /form/submit/:id/eu': 'FormController.submit_eu',
  // EVENTLOG routes

  //'get /api/log': 'EventLogController.get',

/*  'get /*': function(req, res, next) {
    // Fast check for static assets
    if (STATIC_ASSET_REGEX.test(req.path)) return next();
    // Optionally create a routing table hash (in case you want more control)
    // Otherwise, just replace everything below with `return res.view('your/homeView')`
    if (req.path in routingTable) return  HomeController //res.view('homepage');
    // Otherwise move to 404
    return next();
    },*/

    'get /home': 'HomeController',
    'get /obras': 'HomeController',
    'get /obras/:id': 'HomeController',
    'get /obras/new': 'HomeController',
    'get /comparativos': 'HomeController',
    'get /comparativos/new': 'HomeController',
    'get /comparativos/:id': 'HomeController',
    'get /tabla/:id': 'HomeController',
    'get /profile': 'HomeController',

};
