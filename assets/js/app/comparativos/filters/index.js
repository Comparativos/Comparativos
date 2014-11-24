angular.module( 'comparativos.comparativos.filters', [])
.filter('totalSum', function() {
  return function(input) {    
    var total = 0;
  if(input!=null){
      angular.forEach(input.content, function(value, index){
        total = parseFloat(total) + parseFloat(value.total);
      })      
  } 
  return total.toFixed(2);
  };
});