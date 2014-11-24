/**
* Respuesta.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	peticion: {
  		model: 'peticion'
  	},
  	content: {
  		type: 'json',
  		required: true
  	},
    formaPago: {
      type: 'string'
    },    
    file: {
      collection: 'file',
      via: 'respuesta'
    },
    fileUrl: {
      type: 'string'
    }
  }
};

