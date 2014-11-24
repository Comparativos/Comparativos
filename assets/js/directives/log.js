angular.module('comparativos.directives.log', [])
.directive('log', function() {
  return {
    restrict: 'AE',
    templateUrl: 'directives/templates/log.html',
    compile: function CompilingFunction($templateElement, $templateAttributes) {
      return function LinkingFunction($scope, $linkElement, $linkAttributes) {
        switch($scope.log.action) {
          case 'create':
            $scope.log.actionIcon = 'plus'
            $scope.log.actionColor = 'success'
            break
          case 'edit':
            $scope.log.actionIcon = 'pencil'
            $scope.log.actionColor = 'info'
            break            
          case 'delete':
            $scope.log.actionIcon = 'remove'
            $scope.log.actionColor = 'danger'
            break
          case 'archive':
            $scope.log.actionIcon = 'folder-close'
            $scope.log.actionColor = 'warning'
            break
          case 'unarchive':
            $scope.log.actionIcon = 'folder-open'
            $scope.log.actionColor = 'success'
            break
        }
        switch($scope.log.service){
          case 'obra':
            $scope.log.url = '/obras/'+$scope.log.objectId
            break
          case 'comparativo':
            $scope.log.url = '/comparativos/'+$scope.log.objectId
            break
          case 'peticion':
            $scope.log.url = '/comparativos/'+$scope.log.comparativo
            break
          case 'respuesta':
            $scope.log.url = '/comparativos/'+$scope.log.comparativo
            break
        }
      };
    }
  }
})
