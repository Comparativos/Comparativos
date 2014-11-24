angular.module('comparativos.comparativos.controllers.main',[])
.controller( 'ComparativosCtrl', function ComparativosController( $scope, $sails, lodash, config, titleService, comparativos ) {
  titleService.setTitle(config.locale['Header.Comparativos']);
  $scope.locale = config.locale
  $scope.comparativos = comparativos
})