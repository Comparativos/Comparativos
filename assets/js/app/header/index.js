angular.module( 'comparativos.header', [
])

.controller( 'HeaderCtrl', function HeaderController( $scope, $state, config, EventLogModel, $timeout ) {
    
    $scope.currentUser = config.currentUser;
    
    $scope.locale = config.locale

    var navItems = [
        // {title: 'Messages', translationKey: 'navigation:messages', url: '/messages', cssClass: 'fa fa-comments'},
        // {title: 'About', translationKey: 'navigation:about', url:'/about',cssClass: 'fa fa-info-circle'}
    ];

    if (!$scope.currentUser) {
        navItems.push({title: 'Register', translationKey: 'navigation:register', url: '/register', cssClass: 'fa fa-briefcase'});
        navItems.push({title: 'Login', translationKey: 'navigation:login', url: '/login', cssClass: 'fa fa-comments'});
    }

    $scope.navItems = navItems

    $scope.eventLogs = window.lastLogs

    $scope.alert = false

    EventLogModel.bind($scope.eventLogs, function(){
        $scope.alert = true;
        /*$timeout(function(){
            $scope.alert = false;
        },500)*/
    })
    $scope.removeAlert = function() {
        $scope.alert = false;
    }
});