var locales = {
  es: '../../config/locales/es.json', 
  eu: '../../config/locales/eu.json'
}

var homepageLocales = {
  es: '../../config/locales/home_es.json', 
  eu: '../../config/locales/home_eu.json'
}

var politicas = {
  es: 'politicas_es.jade',
  eu: 'politicas_eu.jade',
}

var preguntas = {
  es: 'preguntas_es.jade',
  eu: 'preguntas_eu.jade',
}

module.exports = {
	index: function(req, res) {
		if(req.user){
      EventLogService.getLast(req.user.id, function(err, logs){
  			res.view('homepage',{
  				currentUser: req.user,
          logs: logs,
          siteUrl: process.env.HEROKU_URL,
          locale: req.user.idioma? require(locales[req.user.idioma]): require(locales.es)
  			});
      })
		} else {
			res.view('notloggedhome',{
        locale: require(homepageLocales[req.getLocale()])
      })
    }
	},

  politicas: function (req, res) {
      res.view(politicas[req.getLocale()]);
  },

  preguntas: function (req, res) {
    res.view(preguntas[req.getLocale()]);
  },

  es: function(req, res){
    req.session.locale = 'es'
    res.redirect('/')
  },
  eu: function(req, res){
    req.session.locale = 'eu'
    res.redirect('/')
  }
};
