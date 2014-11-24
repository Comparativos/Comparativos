angular.module( 'comparativos.home', [
])

.config(function config( $stateProvider ) {
	$stateProvider.state( 'home', {
		url: '/home',
		controller: 'HomeCtrl',
		templateUrl: 'home/templates/home.html'
	});
})

.controller( 'HomeCtrl', function HomeController( $scope, titleService, EventLogModel, config ) {
	titleService.setTitle('Home');
  $scope.locale = config.locale
	EventLogModel.get().then(function(eventLogs){
		$scope.eventLogs = eventLogs;
	});

});