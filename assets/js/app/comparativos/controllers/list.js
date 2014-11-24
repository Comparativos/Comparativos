angular.module('comparativos.comparativos.controllers.list',[])
.controller( 'ComparativosListCtrl', 
  function ComparativosListController(
    $stateParams, 
    $q, 
    $scope, 
    $sails, 
    lodash, 
    config, 
    titleService, 
    ComparativoModel, 
    ngTableParams, 
    $filter, 
    $modal,
    $state
  ) {
    //$scope.comparativos = comparativos
    $scope.locale = config.locale

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,          // count per page
      sorting: {
          updatedAt: 'desc'    // initial sorting
      },
      filter: {
        title: ''
      }
    }, {
      total: $scope.comparativos.length, // length of data
      getData: function($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')($scope.comparativos, params.orderBy()) :
          $scope.comparativos;
        orderedData = params.filter ?
          $filter('filter')(orderedData, params.filter()) :
          orderedData                                
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()))
      }
    }); 


    $scope.new = function () {
      var modalInstance = $modal.open({
        templateUrl: 'app/comparativos/templates/edit.html',
        controller: 'ComparativosEditCtrl',
        size: 'lg',
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

      modalInstance.result.then(function (newComparativo) {
        $scope.comparativos.push(newComparativo)
        // $scope.tableParams.reload()
        var idComparativo = newComparativo.id
        //console.log(newComparativo.id)
        $state.go('comparativos.view',{id:idComparativo})
      });

    }


    $scope.destroyComparativo = function(comparativo) {
      if(confirm("¿Estas seguro?")){
        ComparativoModel.delete(comparativo).then(function(model) {
          $scope.comparativos.splice($scope.comparativos.indexOf(comparativo),1)
          $scope.tableParams.reload()
        });
      }
    };

    function getObraByName(name){
      var obra = {}
      for(var i=0;i<comparativos.length;i++){
        if(comparativos[i].obra.title===name){
          obra = {
            'id': comparativos[i].obra.title,
            'title': comparativos[i].obra.title
          };
          break;
        }
      }
      return obra
    }


    $scope.obras = function(column) {
      var def = $q.defer(),
      arr = [],
      obras = [];
      angular.forEach($scope.comparativos, function(item){
        if (inArray(item.obra.title, arr) === -1) {
          arr.push(item.obra.title)
          obras.push({
            'id': item.obra.title,
            'title': item.obra.title
          });
        }
      });
      // $filter('orderBy')(obras, '-title')
      def.resolve($filter('orderBy')(obras, '+title'))
      return def
    };


    var inArray = Array.prototype.indexOf ?
      function (val, arr) {
          return arr.indexOf(val)
      } :
      function (val, arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === val) return i;
        }
        return -1;
      }
  }
)