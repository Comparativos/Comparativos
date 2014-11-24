/**
 * ObraController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash');

module.exports = {
	getAll: function(req, res) {
		User.getOne(req.user.id, function(err, user){
			var obras = user.obras;
			if(user.obras.length>0){
				var obrasIds = [];
				for(var i=0;i<obras.length;i++){
					obrasIds.push(obras[i].id)
				}	
				Obra.find()
				.where({id:obrasIds})
				.where({deleted: { '!' : true }})
				// .populate('comparativos')
				.exec(function(err,obras){
					res.json(obras)
				})
			} else {
				res.json([])
			}			
		})

	},

	getOne: function(req, res) {
		Obra.getOne(req.param('id'), function(err, model) {
			if(err){
				sails.log.error(err)
			}
			Obra.subscribe(req.socket, model);
			res.json(model);
		})
	},

	create: function (req, res) {
		var model = req.body;
		Obra.create(model)
		.exec(function(err, obra) {
			if (err) {
				return console.log(err);
			}
			else {	

				User.findOne(req.user.id).exec(function(err, user){
					user.obras.add(obra.id);
					user.save(function(err, saved){
						console.error(err)
					});
					var eventLog  = {
						obra: obra.id,
						service: 'obra',
						action: 'create',
						objectName: obra.title,
						objectId: obra.id,
						subjectName: req.user.username,
						subjectId: req.user.id
					}
					EventLogService.log(eventLog);
					Obra.publishCreate(obra);
					res.json(obra);
				})

			}
		});
	},

	destroy: function (req, res) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided.');
		}

		// Otherwise, find and destroy the model in question
		Obra.findOne(id).exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			if (!model) {
				return res.notFound();
			}

			Obra.update(id,{deleted:true}, function(err) {
				if (err) {
					return res.serverError(err);
				}
				var eventLog  = {
					obra: model.id,
					service: 'obra',
					action: 'delete',
					objectName: model.title,
					objectId: model.id,
					subjectName: req.user.username,
					subjectId: req.user.id
				}
				EventLogService.log(eventLog);
				Obra.publishDestroy(model.id);
				return res.json(model);
			});
		});
	},


	archive: function(req, res){
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided.');
		}


		// Otherwise, find and destroy the model in question
		Obra.findOne(id).exec(function(err, model) {
			if (err) {
				return res.serverError(err);
			}
			if (!model) {
				return res.notFound();
			}

			if(req.body.archived==='true'){
				model.archived = true;
			} 

			else if(req.body.archived==='false'){
				model.archived = false;
			}	

			 
			model.save(function(err) {
				if (err) {
					return res.serverError(err);
				}
				var eventLog  = {
					obra: model.id,
					service: 'obra',
					action: model.archived? 'archive':'unarchive',
					objectName: model.title,
					objectId: model.id,
					subjectName: req.user.first_name + ' '+ req.user.last_name,
					subjectId: req.user.id
				}
				EventLogService.log(eventLog);
				Obra.publishUpdate(model.id);
				return res.json(model);
			});
		});		
	}

};