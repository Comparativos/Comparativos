angular.module( 'comparativos.comparativos', [
  'comparativos.comparativos.controllers',
  'comparativos.comparativos.filters'
])

.config(function config( $stateProvider ) {
  $stateProvider
    .state( 'comparativos', {
      url: '/comparativos',
      abstract: true,
      controller: 'ComparativosCtrl',
      templateUrl: 'app/comparativos/templates/index.html',
      resolve: {
        comparativos: function($stateParams, $q, ComparativoModel) {
          var deferred = $q.defer();
          ComparativoModel.getAll().then(function(models) {
            deferred.resolve(models);
          });
          return deferred.promise;
        }
      }
    })
    .state( 'comparativos.list', {
      url: '',
      controller: 'ComparativosListCtrl',
      templateUrl: 'app/comparativos/templates/list.html'
    })
    .state( 'comparativos.view', {
      url: '/:id',
      controller: 'ComparativosViewCtrl',
      templateUrl: 'app/comparativos/templates/view.html',
      resolve: {
        comparativo: function($stateParams, $q, ComparativoModel) {
          var deferred = $q.defer();
          ComparativoModel.getOne($stateParams.id).then(function(models) {
            deferred.resolve(models);
          });
          return deferred.promise;
        }
      }
    });
})