/**
 * RespuestaController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	getAll: function(req, res){
		Respuesta.find().exec(function(err, respuestas){
			res.json(respuestas);
		});
	}
};
