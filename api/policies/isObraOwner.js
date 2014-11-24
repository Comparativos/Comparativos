/**
 * isObraOwner
 */
module.exports = function(req, res, next) {

  // var controller = req.options.controller;
  var action = req.options.action;
  if(action ==='getone'|| action==='destroy' || action==='update'){
  	var obraId = req.params.id;

  	Obra.findOne({id:obraId}).populate('owners').exec(function(err,obra){
  		// sails.log.info(comparativo.obra);
  		if(err||!obra){
  			return res.forbidden('You are not permitted to perform this action.');
  		} else {
	  		var isOwner = false;
	  		obra.owners.forEach(function(owner){
	  			if(owner.id==req.user.id){
	  				isOwner = true;
	  			}
	  		});
	  		if(isOwner){
	  			return next();
	  		} else {
	  			return res.forbidden('You are not permitted to perform this action.');
	  		}
  		}
  	})

  } else {
  	return next();
  }
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // 
 }