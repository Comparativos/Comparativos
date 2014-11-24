angular.module( 'comparativos.obras.filters', [])
.filter('showActive', function() {
  return function(input) {
    var actives = [];
    angular.forEach(input, function(val,key){
      if(val.archived){

      }else{
        actives.push(val)
      }
    })
  return actives
  };
}).filter('showArchived', function() {
  return function(input) {
    var archiveds = [];
    angular.forEach(input, function(val,key){
      if(val.archived){
      archiveds.push(val)
      }else{
        
      }
    })
  return archiveds
  };
});