angular.module( 'comparativos', [
	'ui.router',
	'ngSails',
	'angularMoment',
	'lodash',
	'ui.bootstrap',
	'ngTable',
	'comparativos.templates',
	'comparativos.services',
	'comparativos.models',
	'comparativos.directives',
	'comparativos.header',
	'comparativos.home',
	'comparativos.obras',
	'comparativos.comparativos',
	'comparativos.table',
	'comparativos.profile'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
	$urlRouterProvider.when('/logout', function($location){
		window.location = $location.$$absUrl
	});

	$urlRouterProvider.otherwise(function ($injector, $location) {
		console.log($injector)
		if (window.currentUser&&$location.$$path!='/login') {
			return '/comparativos';
		}
		else {
			// pass through to let the web server handle this request
			window.location = $location.$$absUrl;
		}
	});
	$locationProvider.html5Mode(true);
})

.run( function run () {
	moment.lang('es'); // deprecated, use moment.locale instead
})

.controller( 'AppCtrl', function AppCtrl ( $scope, config ) {
	config.currentUser = window.currentUser
	config.locale = window.locale
	config.siteUrl = window.siteUrl ? window.siteUrl : 'http://localhost:1337/'
	if(!config.currentUser) window.location = '/login'
});
