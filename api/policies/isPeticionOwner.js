/**
 * isPeticionOwner
 */
module.exports = function(req, res, next) {

  // var controller = req.options.controller;
  var action = req.options.action;
  if(action ==='getone'|| action==='destroy' || action==='update' || action ==='send'){
  	var peticionId = req.params.id;

  	Peticion.findOne({id:peticionId}).exec(function(err,peticion){
  		
  		if(err||!peticion){
  			return res.forbidden('You are not permitted to perform this action.');
  		} else {
	  		
	  		var comparativoId = peticion.comparativo;  

	  		Comparativo.findOne({id:comparativoId}).exec(function(err,comparativo){
	  			var obraId = comparativo.obra;
			  	User.findOne({id:req.user.id}).populate('obras').exec(function(err, user){
			  		var isOwner = false;
			  		user.obras.forEach(function(obra){
			  			if(obra.id==obraId){
			  				isOwner = true;
			  			}
			  		});
			  		if(isOwner){
			  			return next();
			  		} else {
			  			return res.forbidden('You are not permitted to perform this action.');
			  		}			  		
			  	})	  			
	  		})
  		}
  	})

  } else {
  	return next();
  }
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // 
 }