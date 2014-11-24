// Mailjs. Mail service

var nodemailer = require("nodemailer");


module.exports = {
	sendMail: function(mailOptions, cb){
		smtpTransport.sendMail(mailOptions, function(err, responseStatus){
			if(err){
				sails.log.error(err)
				cb(err, null);
			} else {
		 	  cb(null, responseStatus);
		  }			
		});		
	},

	sendPeticion: function(peticionId, cb){

		Peticion.findOne(peticionId)
		.populate('comparativo')
		.exec(function(err, peticion){
			if(err&&cb) {
				return cb(err, null)
			}
			var mailOptions = {
			    from: "",
			    to: peticion.to.email,
			    subject: "Comparativos.es - Petición de presupuesto / Aurrekontuaren eskaria",
			    html:"",
			    generateTextFromHTML: true 
			}
			Mail.sendMail(mailOptions, function(err, res){
				sails.log.info(err)
				sails.log.info(res)
				if(cb){
					cb(null, true)
				}
			})
		})


	},

	sendWelcome: function(userId){
		User.findOne(userId).exec(function(err, user){
			if(err) return res.serverError(err)
			var mailOptions = {
			    from: "",
			    to: user.email,
			    subject: "Comparativos.es - Bienvenid@ / Ongi etorria",
			    html: "",
			    generateTextFromHTML: true 
			}
			Mail.sendMail(mailOptions, function(err, res){
				sails.log.info(err)
				sails.log.info(res)
			})
		})
	},


	passwordReset: function(id, email, cb){
		var mailOptions = {
		    from: "",
		    to: email,
		    subject: "Comparativos.es - Reestablecer contraseña / Pasahitza aldatu",
		    html: "",
		    generateTextFromHTML: true 
		}
		Mail.sendMail(mailOptions, function(err, res){
			sails.log.info(err)
			sails.log.info(res)
			cb(err,res)
		})					
	}
}