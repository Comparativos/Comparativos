// POR AHORA NO SE USA PARA NADA, MEJOR BORRARLO

module.exports = {
	getAll: function(req, res) {
		User.getAll(function(err, users) {
			res.json(users);
		})
	},

	getOne: function(req, res) {
		User.getOne(req.param('id'))
		.spread(function(model) {
			res.json(model);
		})
		.fail(function(err) {
			// res.send(404);
		});
	},
	update: function(req, res){
		var update = {}
		update[req.body.field] = req.body.data
		User.update(req.user.id,update).exec(function afterwards(err,updated){
		  if (err) {
		    // handle error here- e.g. `res.serverError(err);`
		    return res.json({error: err.code, updatedUser: null})
		  } else {
		  	return res.json({error:null, updatedUser: updated[0]})
		  }
		});
	}

	// create: function (req, res) {
	// 	var model = {
	// 		username: req.param('username'),
	// 		email: req.param('email'),
	// 		first_name: req.param('first_name')
	// 	};

	// 	User.create(model)
	// 	.exec(function(err, model) {
	// 		if (err) {
	// 			return console.log(err);
	// 		}
	// 		else {
	// 			User.publishCreate(model.toJSON());
	// 			res.json(model);
	// 		}
	// 	});
	// }
};