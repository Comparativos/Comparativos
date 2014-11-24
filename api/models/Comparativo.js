/**
* Comparativo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: {
    	type:'string',
    	required: true
    },
    description: {
    	type: 'string'
    },
    obra:{
        model:'obra',
        required: true
    },
    peticiones: {
    	collection: 'peticion',
    	via: 'comparativo'
    },
    content: {
    	type: 'json',
    	required: true
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
  },

	getAllFromUser: function(userId, cb) {
		User.getOne(userId, function(err, user){         
            if(err){
                sails.log.warning('comparativos:getAll:getUser:error', {err: err})
                cb(err, null)
            }       
            if(user){
                var obras = user.obras
                var obrasIds = []
                for(var i=0;i<obras.length;i++){
                    if(obras[i].deleted||obras[i].archived){

                    } else {
                        obrasIds.push(obras[i].id)
                    }
                }
                if(obrasIds.length===0) return cb(null, [])       
                Comparativo.find()
                .where({obra:obrasIds})
                .where({deleted: { '!' : true }})
                .populate('obra')
                .populate('peticiones')
                .exec(function(err,comps){
                    if(err){
                        sails.log.warning('comparativos:getAll:error', {err: err})
                        cb(err,null)
                    } else {
                        cb(null, comps)
                    }
                })      
            } else {
                sails.log.warning('comparativos:getAll:geUser:notFound', {id: userId})
                cb({status:'400'},null)
            }
        })
	},

	getOne: function(id, cb) {
        Comparativo.findOne(id)
        .populate('obra')
        .populate('peticiones')
        .exec(function(err, comparativo) {
            if(err){
                sails.log.warning('comparativos:getOne:error', {err: err, comparativo: id})
                return cb(err, null)
            }               
            Peticion.find({comparativo: comparativo.id})
            .populate('respuestas')
            .exec(function(err, peticiones){
                var petitions = []
                if(!err){
                    var ids = []
                    _.forEach(peticiones, function(peticion){
                        _.forEach(peticion.respuestas,function(respuesta){
                            ids.push(respuesta.id)
                        })
                    })
                    Respuesta.find(ids)
                    .populate('file')
                    .exec(function(err, populatedRespuestas){
                        if(err){
                            sails.log.error('comparativos:getOne:getFile:error',err)
                            return cb(err, null)
                        } else {
                            
                            _.forEach(peticiones, function(peticion){
                                var respuestas =  _.where(populatedRespuestas, { 'peticion': peticion.id })
                                
                                _.forEach(respuestas, function(respuesta){
                                    peticion.respuesta = respuesta
                                })

                                petitions.push(peticion)
                            })
                            comparativo.peticiones = petitions
                            return cb(null, comparativo)
                        }
                    })
                } else {
                    sails.log.warning('comparativos:getOne:populate:error', {err: err, comparativo: id})
                    return cb(err, null)
                }
            })
        })
	}
};

