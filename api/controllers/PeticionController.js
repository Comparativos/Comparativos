/**
 * PeticionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash');

module.exports = {
	getAll: function(req, res) {
		Peticion.find().populateAll().exec(function(err,models){
			res.json(models)
		});
	},

	getOne: function(req, res) {
		Peticion.findOne({id:req.param('id')}).populate('respuestas').exec(function(err, model) {
			Peticion.subscribe(req.socket, model);
			res.json(model);
		})
	},

	create: function(req, res) {
		var peticion = {
			to: req.body.to,
			content: req.body.content,
			comparativo: req.body.comparativo,
		};

		Peticion.create(peticion).exec(function(err, savedPeticion){
			Comparativo.findOne(peticion.comparativo).exec(function(err, comparativo){

				if(err) return res.serverError(err)
				if(!comparativo) return res.notFound()

				var eventLog  = {
					obra: comparativo.obra,
					comparativo: comparativo.id,
					comparativoName: comparativo.title,
					service: 'peticion',
					action: 'create',
					objectName: peticion.to.name,
					objectId: savedPeticion.id,
					subjectName: req.user.first_name + ' '+ req.user.last_name,
					subjectId: req.user.id
				}
				EventLogService.log(eventLog);
			})
			if(req.body.sendmail){
				Mail.sendPeticion(savedPeticion.id, function(err, sended){
				})
			}
			return res.json(savedPeticion);

		});
	},

	destroy: function (req, res) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided.');
		}

		// Otherwise, find and destroy the model in question
		Peticion.findOne(id).exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			if (!model) {
				return res.notFound();
			}

			Peticion.destroy(id, function(err) {
				if (err) {
					return res.serverError(err);
				}

				Peticion.publishDestroy(model.id);
				return res.json(model);
			});
		});
	},

	send: function(req, res) {
		Mail.sendPeticion(req.body.id, function(err, sended){

		})
	}

};