var Keen = require('keen.io')
var keenClient

module.exports = {
	log: function(eventLog, cb){

		if(eventLog.service==='auth'&&eventLog.action==='create'){a
			Mail.sendWelcome(eventLog.subjectId)
		}

		EventLog.create(eventLog).exec(function(err, log){
			if(log.obra){
				sails.sockets.broadcast(log.obra,'eventlog', log);
			}
			if(cb){
				if(err){
					console.log(err)
					cb(err,null)
				} else {
					console.log('eventLog saved!')
					cb(null, log)
				}
			}			
		})

		keenClient.addEvent("eventLog", eventLog, function(err, res) {
		    if (err) {
		        sails.log.error("KeenIO event add error",err);
		    } else {
		    }
		});

	},

	getLast: function(userId, cb){
		User.getOne(userId, function(err, user){
			if(err){
				sails.log.warning('eventLog:get:getUser:error', {err: err})
				return cb(err,null)
			}		
			if(user){
				var obras = user.obras;
				var obrasIds = [];
				for(var i=0;i<obras.length;i++){
					obrasIds.push(obras[i].id)
				}		
				EventLog.find()
				.where({obra:obrasIds})
				.limit(50)
				.sort({createdAt: 'desc'})
				.exec(function(err,eventLogs){
					if(err){
						sails.log.warning('eventLog:getLast:getEventlog:error', {err: err})
						return cb(err,null)
					} else {
						return cb(null, eventLogs)
					}
				})	
			}
		});	
	},

	initKeen: function(){
		keenClient = Keen.configure({
		    projectId: process.env.KEEN_PROJECT_ID,
		    writeKey: process.env.KEEN_WRITE_KEY
		});
	}
}