module.exports = {
  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    first_name: { type: 'string' },
    last_name: {type: 'string'},    
    passports : { collection: 'Passport', via: 'user' },
    constructora : { type : 'string' },
    cargo : { type : 'string' },
    rol : { 
      type : 'string'
    },
    phone : { type : 'integer' },
    idioma : { 
      type : 'string',
      defaultsTo : 'es'
    },
    obras:{
        collection: 'obra',
        via: 'owners'
    }   
  },

  getAll: function(cb) {
    User.find()
    // .populateAll()
    .then(function (models) {
      cb(null, [models]);
    });
  },

  getOne: function(id, cb) {
    User.findOne(id)
    .populate('obras')
    .then(function (model) {
      cb(null, model);
    });
  }
};