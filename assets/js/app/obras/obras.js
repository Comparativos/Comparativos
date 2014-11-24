angular.module( 'comparativos.obras', ['comparativos.obras.filters'])

.config(function config( $stateProvider ) {
	$stateProvider.state( 'obras', {
		url: '/obras',
		abstract: true,
		controller: 'ObrasCtrl',
		templateUrl: 'app/obras/templates/obras.html'
	})
	.state( 'obras.list', {
		url: '',
		controller: 'ObrasListCtrl',
		templateUrl: 'app/obras/templates/obras-list.html',
		resolve: {
		    obras: function($stateParams, $q, ObraModel) {
		        var deferred = $q.defer();
		        ObraModel.getAll().then(function(models) {
		        	deferred.resolve(models);
		        });
		        return deferred.promise;
		    }
		}
	})
	.state( 'obras.view', {
		url: '/:id',
		controller: 'ObrasViewCtrl',
		templateUrl: 'app/obras/templates/obras-view.html',
		resolve: {
		    obra: function($stateParams, $q, ObraModel) {
		        var deferred = $q.defer();
		        ObraModel.getOne($stateParams.id).then(function(models) {
		        	deferred.resolve(models);
		        });
		        return deferred.promise;
		    }
		}
	})
})

.controller( 'ObrasCtrl', function ObrasController( $scope, $sails, lodash, config, titleService ) {
	// titleService.setTitle('Obras');
	$scope.locale = config.locale
	titleService.setTitle(config.locale['Header.Obras']);
})

.controller( 'ObrasListCtrl', function ObrasListController( $scope, $sails, lodash, config, titleService, obras, ObraModel, $modal ) {
	$scope.obras = obras;

  $scope.open = function (size) {
		var modalInstance = $modal.open({
		  templateUrl: 'app/obras/templates/obras-new.html',
		  controller: ObrasNewController,
		  size: 'sm'
		});

		modalInstance.result.then(function (newObra) {
		  $scope.obras.push(newObra)
		});
	}
})

.controller( 'ObrasViewCtrl', function ObrasViewController( $scope, $sails, lodash, config, titleService, obra, ObraModel, $state ) {
	$scope.obra = obra;

	$scope.archivarObra = function(archived){
		$scope.archiving = true;
		ObraModel.archive(obra.id, archived).then(function(model){
			$scope.obra.archived = model.archived;
			$scope.archiving = false;
		})
	}

	$scope.destroyObra = function() {
		if(confirm("¿Estas seguro?")){
			ObraModel.delete(obra).then(function(model) {
				// model has been deleted, and removed from $scope.comparativos
				$state.go('obras.list')
			});
		}
	};
})


// Controlador del modal de nuevo comparativo
function ObrasNewController( $scope, $modalInstance, config, $state, ObraModel ) {
	$scope.newObra = {};
	$scope.locale = config.locale
	$scope.createObra = function(){
		console.log("create obra")
		$scope.isSubmitting = true;
		ObraModel.create($scope.newObra).then(function(model) {
			$scope.result = 'success';
			$scope.newObra = {};
			$modalInstance.close(model);
		});
	}
	$scope.close = function(){
		$modalInstance.dismiss('close')
	}
}