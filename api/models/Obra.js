/**
* Obra.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		title: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string'
		},		
		comparativos:{
		    collection: 'comparativo',
		    via: 'obra'
		},
		owners: {
		    collection: 'user',
		    via: 'obras',
		    dominant:true
		},
		eventLog: {
			collection: 'eventLog',
			via: 'obra'
		},
    archived: {
      type: 'boolean',
      defaultsTo: false
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
	},


	// THIS IS NOW IN THE CONTROLLER
	// afterCreate: function (obra, next) {
	// 	console.log(obra);
	// 	// set message.user = to appropriate user model
	// 	User.getOne(obra.owner)
	// 	.spread(function(user) {
	// 		user.obras.add(obra.id);
	// 		user.save(function(err, savedUser){
	// 			next(null, obra);	
	// 		})
	// 	});
	// },

	getAll: function(ownerId,cb) {
		Obra.find()
		// .where({owners: owner})
		// TODO: sort by createdAt DESC does not work here, something to do with a camelCase key names bug
		.sort({createdAt: 'desc'})
		.populate('owners')
		.populate('comparativos')
		.then(function (models) {
			cb(null, [models]);
		});
	},

	getOne: function(id, cb) {
		Obra.findOne(id)
		.populate('owners')
		//.populate('comparativos')
		.then(function (model) {
			Comparativo.find()
			.where({obra: model.id})
			.where({deleted: { '!' : true }})
			.then(function(comparativos){
				model.populatedComparativos = comparativos
				cb(null, model);
			})
		});
	}

};

