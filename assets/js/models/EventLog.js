angular.module('comparativos.models.eventlog', [])

.service('EventLogModel', function($q, lodash, utils, $sails) {
	this.get = function() {
		var deferred = $q.defer();
		var url = utils.prepareUrl('log');

		$sails.get(url, function(models) {
			return deferred.resolve(models);
		});

		return deferred.promise;
	}

  this.bind = function(logCollection, cb){
    var url = utils.prepareUrl('eventlog/subscribe')
    $sails.get(url, function() {
      $sails.on('eventlog', function(log){
        console.log(log)
        logCollection.unshift(log)
        if(cb) cb(log)
      })      
    });
  }
});