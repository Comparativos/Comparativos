angular.module( 'comparativos.table', ['comparativos.table.filters'])

.config(function config( $stateProvider ) {
	$stateProvider
	.state( 'table', {
		url: '/tabla/:id',
		abstract: true,
		controller: 'TableCtrl',
		templateUrl: 'table/templates/table.html',
		resolve: {
		    comparativo: function($stateParams, $q, ComparativoModel) {
		        var deferred = $q.defer();
		        ComparativoModel.getOne($stateParams.id).then(function(models) {
		        	deferred.resolve(models);
		        });
		        return deferred.promise;
		    }
		}
	})
	.state( 'table.view', {
		url: '',
		controller: 'TableViewCtrl',
		templateUrl: 'table/templates/table-view.html'
	});
})

.controller( 'TableCtrl', function TableController( $scope, titleService, config, comparativo ) {	
	$scope.locale = config.locale
})

.controller( 'TableViewCtrl', function TableViewController( $scope, titleService, comparativo, $modal ) {	
	
	$scope.crearPeticion = function () {
	  var modalInstance = $modal.open({
	    templateUrl: 'table/templates/peticion-new.html',
	    controller: PeticionNew,
	    size: 'sm',
	    scope: $scope
	  });
	  //Callback del modal newPeticion
	  modalInstance.result.then(function (newPeticion) {
	    $scope.comparativo.petitions.push(newPeticion);
	  });
	}

	var answeredPetitions = []
	var bestValues = []

	angular.forEach(comparativo.petitions, function(peticion, key){
		var total = 0;
		if(peticion.answered){
			var petValues = [];
			angular.forEach(peticion.respuestas[0].content, function(respuesta, key){
				//añadimos al total el total de esta respuesta
				total += parseFloat(respuesta[0])*comparativo.content[key].quantity
				// creamos el total de esta respuesta (precio*qty), 2 decimales
				respuesta[2] = (parseFloat(respuesta[0])*comparativo.content[key].quantity).toFixed(2)
				petValues.push(respuesta[0])
			})
			bestValues.push(petValues);
			peticion.totalPrice = total.toFixed(2)
			answeredPetitions.push(peticion)
		}
	})

	if(bestValues.length){

		var petRowBests = [];
		var petRowWorsts = [];

		for(var i=0;i<bestValues[0].length;i++){
			var best = 0;
			var worst = 0;
			for(var y=0;y<bestValues.length;y++){

				if(y===0){
					best=parseFloat(bestValues[y][i]);
					worst=parseFloat(bestValues[y][i]);
				}
				else{ 
					if(best>parseFloat(bestValues[y][i])){
						best=parseFloat(bestValues[y][i]);
					}
					if(worst<parseFloat(bestValues[y][i])){
						worst=parseFloat(bestValues[y][i]);
					}
				}
			}

			petRowBests.push(best)
			petRowWorsts.push(worst)
		}


		$scope.petRowBests = petRowBests;
		$scope.petRowWorsts = petRowWorsts;
	}

	comparativo.petitions = answeredPetitions;
	comparativo.petitions.sort(compareTotalPrice);

	$scope.comparativo = comparativo;
})

function compareTotalPrice(a,b) {
	return a.totalPrice - b.totalPrice;
}

// Controller del modal de nueva peticion
function PeticionNew($scope, PeticionModel, $modalInstance){	
	$scope.newPeticion = {
		to: {}
	}
	$scope.createPeticion = function(){

		var peticion = {
			to: {
				email: $scope.newPeticion.to.email ? $scope.newPeticion.to.email : 'noemail@comparativos.es' ,
				name: $scope.newPeticion.to.name
			},
			comparativo: $scope.comparativo.id,
			content: $scope.newPeticion.content,
			obra: $scope.comparativo.obra.id

		}	
		PeticionModel.create(peticion).then(function(model) {
			$modalInstance.close(model)

		});
	}
}