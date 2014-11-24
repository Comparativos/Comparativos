angular.module( 'comparativos.services.config', ['lodash'])

.service('config', function(lodash) {

	// private vars here if needed

	return {
		siteName: 'Comparativos.es',
		// no trailing slash!
		siteUrl: '/',
		apiUrl: '/api',
		currentUser: false,
    locale:false
	};

});