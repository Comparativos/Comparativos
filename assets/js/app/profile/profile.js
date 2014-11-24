angular.module( 'comparativos.profile', [
])

.config(function config( $stateProvider ) {
	$stateProvider.state( 'profile', {
		url: '/profile',
		controller: 'ProfileCtrl',
		templateUrl: 'app/profile/templates/profile.html'
	});
})

.controller( 'ProfileCtrl', function ProfileController( $scope, titleService, config, $sails, $modal ) {
	$scope.locale = config.locale
  $scope.currentUser = config.currentUser;
	titleService.setTitle(config.locale["Header.MiPerfil"]);
  $scope.userLocale = $scope.currentUser.locale
  
  $scope.setLocale = function(){
    $sails.put('/api/user',{field:'idioma',data:$scope.userLocale}, function(){
      window.location.reload()
    })
  }


  $scope.edit = function(field) {
    $scope.editingField = field
    var modalInstance = $modal.open({
      templateUrl: 'app/profile/templates/edit.html',
      controller: 'ProfileEditCtrl',
      size: 'sm',
      scope: $scope
    });

    modalInstance.result.then(function (updatedUser) {
      config.currentUser = updatedUser
      $scope.currentUser = updatedUser
    });

  }


})
.controller( 'ProfileEditCtrl', function ProfileEdit( $scope, config, $modalInstance, $sails){

  $scope.data = {
    value : config.currentUser[$scope.editingField]
  }
  
  $scope.submit = function(){
    $sails.put('/api/user',{field:$scope.editingField,data:$scope.data.value}, function(response){
      console.log(response)
      if(response.error){
        $scope.error = response.error
      } else {
        $modalInstance.close(response.updatedUser)
      }
    })
  }

  $scope.close = function(){
    $modalInstance.dismiss('close')
  }

})