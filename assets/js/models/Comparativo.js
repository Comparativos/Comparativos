angular.module('comparativos.models.comparativo', [])

.service('ComparativoModel', function($q, lodash, utils, $sails) {
	this.getAll = function() {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo');
		$sails.get(url, function(models) {
			return deferred.resolve(models);
		});

		return deferred.promise;
	};

	this.create = function(newModel) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo');

		$sails.post(url, newModel, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.update = function(comparativo) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo/'+comparativo.id);

		$sails.put(url, comparativo, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.getOne = function(id) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo/' + id);

		$sails.get(url, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};	

	this.delete = function(model) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo/' + model.id);

		$sails.delete(url, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.send = function(email) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('comparativo/send');

		$sails.post(url, email, function(response) {
			return deferred.resolve(response);
		});

		return deferred.promise;		
	}
});