angular.module('comparativos.comparativos.controllers.edit',[])
.controller( 'ComparativosEditCtrl', function ComparativosEdit( 
  $scope, 
  config, 
  ComparativoModel, 
  ObraModel, 
  $state,
  $modalInstance,
  obras,
  $q
){
  $scope.locale = config.locale
  if($scope.comparativo){
    console.log($scope.comparativo)
    $scope.newComparativo = angular.copy($scope.comparativo);
    $scope.newComparativo.obra = $scope.newComparativo.obra.id
  } else {
    $scope.newComparativo = {};
    $scope.newComparativo.obra = false;
    $scope.newComparativo.content = [];
  }

  $scope.obras = []
  $scope.newObra = {}
  $scope.status = {}

  angular.forEach(obras, function(val, key){
    if(!val.archived){
      $scope.obras.push(val)
    }
  })

  $scope.submitComparativo = function(){
    
    if(!$scope.newComparativo.obra&&!$scope.newObra.title){

    } else {

      $scope.submitingNewComparativo = true;

      angular.forEach($scope.newComparativo.content, function(item){
        delete item.$$hashKey
      });


      var newComp = {
        title: $scope.newComparativo.title,
        content: $scope.newComparativo.content,
        description: $scope.newComparativo.description
      }

      var deferred = $q.defer()

      if($scope.status.creatingNewObra){
        // Si hay obra nueva la creamos antes de crear el comparativo
        newComp.newObra = $scope.newObra.title
        ObraModel.create({title:$scope.newObra.title}).then(function(model) {
          deferred.resolve(model.id)
        })
      } else {
        deferred.resolve($scope.newComparativo.obra)
      }

      deferred.promise.then(
        function success(data){
          if($scope.comparativo){
            newComp.id = $scope.newComparativo.id
            newComp.obra = data
            ComparativoModel.update(newComp).then(function(model) {
              $modalInstance.close(model)
            })      
          } else {
            newComp.obra = data
            ComparativoModel.create(newComp).then(function(model) {
              $modalInstance.close(model)
            })      
          }        
        },
        function error(err){

        },
        function update(update){

        }
      )
    }
  }

  $scope.addRow = function(){
    var newRow = {
      id: $scope.newComparativo.content.length,
      order: $scope.newComparativo.content.length,
      unit:'',
      concept: '',
      quantity: '',
      notes: ''
    };
    $scope.newComparativo.content.push(newRow);
  }

  $scope.close = function(){
    $modalInstance.dismiss('close')
  }
})
