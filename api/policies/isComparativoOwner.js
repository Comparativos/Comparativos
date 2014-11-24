/**
 * isComparativoOwner
 */
module.exports = function(req, res, next) {

  // var controller = req.options.controller;
  var action = req.options.action;
  // requestean :id dagoen ala ez txek bat egin liteke agian...
  if(action ==='getone'|| action==='destroy' || action==='update'|| action==='download'){
  	var comparativoId = req.params.id;

  	Comparativo.findOne({id:comparativoId}).exec(function(err,comparativo){
  		// sails.log.info(comparativo.obra);
  		if(err||!comparativo){
  			return res.forbidden('You are not permitted to perform this action.');
  		} else {
  			var comparativoObraId = comparativo.obra;
		  	User.findOne({id:req.user.id}).populate('obras').exec(function(err, user){
          // esto esta cutre. usar lodash?
		  		var isOwner = false;
		  		user.obras.forEach(function(obra){
		  			if(obra.id==comparativoObraId){
		  				isOwner = true;
		  			}
		  		});
		  		if(isOwner){
		  			return next();
		  		} else {
		  			return res.forbidden('You are not permitted to perform this action.');
		  		}
		  	})
  		}
  	})


  } else {
  	return next();
  }
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
};




