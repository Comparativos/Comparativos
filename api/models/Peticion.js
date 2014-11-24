/**
* Peticion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	respuestas: {
  		collection: 'respuesta',
  		via: 'peticion'
  	},
  	comparativo: {
  		model: 'comparativo'
  	},
  	to: {
  		// name, email
  		type:'json'
  	},
  	content: {
  		type: 'text'
  	},
  	open: {
  		type: 'boolean',
  		defaultsTo: true
  	},
  	sent: {
  		type: 'boolean',
  		defaultsTo: false
  	},
    mandrillId: {
      type: 'string'
    },
    answered: {
      type: 'boolean',
      defaultsTo: false
    },
    formaPago: {
      type: 'string'
    }
  }
};

