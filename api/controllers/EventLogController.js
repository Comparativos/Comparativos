/**
 * EventLogController
 *
 * @description :: Server-side logic for managing eventlogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe: function(req, res) {
		User.getOne(req.user.id, function(err, user){
			_.forEach(user.obras,function(obra){
				sails.sockets.join(req.socket, obra.id);
			})
			res.json({
			  message: 'Subscribed!'
			});
		})

	}

};

