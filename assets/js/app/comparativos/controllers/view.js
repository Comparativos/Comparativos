angular.module('comparativos.comparativos.controllers.view',[])
.controller( 'ComparativosViewCtrl', 
  function ComparativosViewCtrl( 
    $scope, 
    $sails, 
    lodash, 
    config, 
    titleService, 
    ComparativoModel, 
    comparativo, 
    PeticionModel,
    $modal
  ) {
  //titleService.setTitle('Comparativo: '+ comparativo.title);

  var answeredPetitions = []
  var bestValues = []
  $scope.siteUrl = config.siteUrl
  angular.forEach(comparativo.peticiones, function(peticion, key){
    var total = 0;
    if(peticion.answered){
      var petValues = [];
      angular.forEach(peticion.respuesta.content, function(respuesta, key){
        //añadimos al total el total de esta respuesta
        total += parseFloat(respuesta[0])*comparativo.content[parseInt(key)].quantity
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
  if(comparativo.petitions) comparativo.petitions.sort(compareTotalPrice);

  $scope.comparativo = comparativo;




  /*OPEN EDIT MODAL*/
  $scope.edit = function () {
    var modalInstance = $modal.open({
      templateUrl: 'app/comparativos/templates/edit.html',
      controller: 'ComparativosEditCtrl',
      size: 'lg',
      scope: $scope,
      resolve: {
        obras: function($stateParams, $q, ObraModel) {
          var deferred = $q.defer();
          ObraModel.getAll().then(function(models) {
            deferred.resolve(models)
          });
          return deferred.promise
        }
      }
    });
    modalInstance.result.then(function (comparativo) {
      $scope.comparativo = comparativo
      // TODO: hace falta acutalizar la coleccion "original" de comparativos para que la tabla esté actualizadaZ
    });
  }
 
  $scope.newPeticion = {
  };

  $scope.send = function(){
    if($scope.newPeticion.to.email)
    {
      var peticion = {
        to: {
          email: $scope.newPeticion.to.email ? $scope.newPeticion.to.email : 'noemail@comparativos.es' ,
          name: $scope.newPeticion.to.name,
        },
        comparativo: $scope.comparativo.id,
        content: $scope.newPeticion.content,
        obra: $scope.comparativo.obra.id,
        sendmail: true
      } 
      PeticionModel.create(peticion).then(function(model) {
        $scope.newPeticion = {}
        if(!$scope.comparativo.petitions) $scope.comparativo.petitions = []
        $scope.comparativo.peticiones.unshift(model)
      });
    }else
    {
      var peticion = {
        to: {
          name: $scope.newPeticion.to.name,
        },
        comparativo: $scope.comparativo.id,
        content: $scope.newPeticion.content,
        obra: $scope.comparativo.obra.id
      } 
      PeticionModel.create(peticion).then(function(model) {
        $scope.newPeticion = {}
        if(!$scope.comparativo.petitions) $scope.comparativo.petitions = []
        $scope.comparativo.peticiones.unshift(model)
      });
    }
   
  }


  $sails.on('peticion', function (envelope) {
    switch(envelope.verb) {
      case 'updated':
        var peticionToUpdate = lodash.where($scope.comparativo.petitions, { 'id': envelope.id });
        if(peticionToUpdate.length){
          var p = peticionToUpdate[0];
          p.sent = true;
        }
        break;  
      // case 'destroyed':
      //  lodash.remove($scope.comparativo.peticiones, {id: envelope.id});
      //  break;              
    }
  });


  $scope.destroyPeticion = function(peticion){
    if(confirm("¿Esta seguro?")){
      PeticionModel.delete(peticion).then(function(model) {
        lodash.remove($scope.comparativo.petitions, {id: model.id});
      });
    }
  }

  $scope.prepareDownload = function(peticion){
    $sails.get('/api/comparativo/file/'+peticion.fileUrl)
      .success(function(data){
        //peticion.fileDownloadUrl = data.signed_request
        window.open(data.signed_request)

      })
  }


  // Hay maneras "más nativas" de angular para esto, mira las directivas 'ng-show' y 'ng-hide'

  $scope.ShowMail = function(){
    document.getElementById("mail").style.display="inline";
    document.getElementById("peticion").style.display="none";
  }
  
  $scope.ShowPeticion = function(){
   document.getElementById("peticion").style.display="inline";
   document.getElementById("mail").style.display="none";
   }
});
