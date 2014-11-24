// FormController.js
var locales = {
  es: '../../config/locales/es.json', 
  eu: '../../config/locales/eu.json'
}

module.exports = {
  index: function(req, res){
    //console.log("ES")
    Peticion.findOne({id: req.params.id, open: true}).exec(function(err, peticion){
      //console.log("Peticion: ", peticion)
      //console.log("id: ", req.params.id)
      if(peticion){
        Comparativo.findOne({id:peticion.comparativo}).exec(function(err, comparativo){
          if(!err&&comparativo){
            res.view({
              title: 'Formulario: ' + comparativo.title + '| Comparativos.es',
              form: comparativo,
              peticion: peticion,
              locale: require(locales.es)//require(locales.es)
              //layout: 'form/layout'
            });
          }
        })        
      } else {}
    })
  },
  submit: function(req, res){
    //console.log('submit')
    //console.log(req.body)
    // falta lógica para peticiones ya respondidas (hay algo en la view)
    Peticion.findOne({id:req.params.id}).exec(function(err, peticion){
      console.log(peticion)
      if(!err){
        if(peticion){
          if(peticion.answered){
            //console.log("peticion is answered")
            return res.view({
                  title: req.__('Proveedor.ErrorTitle'),
                  message:  req.__('Proveedor.YahayRespuestaMsn')
                });
          } else {          
            var formaPago = req.body.formaPago
            var fileUrl = req.body.file_url
            if(fileUrl&&fileUrl.length>0){
              fileUrl = fileUrl.split('/').pop()
            }
            var content = req.body
            delete content.formaPago
            delete content.file_url
            Respuesta.create({
              peticion: peticion.id,
              formaPago: formaPago,
              content: content,
              fileUrl: fileUrl
            }).exec(function(err, respuesta){
                console.log(err)
                console.log(respuesta)
              if(!err&&respuesta){
                peticion.answered = true;
                peticion.save(function(err, updatedpeticion){
                  Peticion.publishUpdate(updatedpeticion.id, {answered: true})
                  Comparativo.findOne(peticion.comparativo).exec(function(err,comparativo){
                    if(err) return sails.serverError(err)
                    var eventLog  = {
                      obra: comparativo.obra,
                      comparativo: comparativo.id,
                      comparativoName: comparativo.title,
                      service: 'respuesta',
                      action: 'create',
                      objectName: peticion.to.name,
                      objectId: respuesta.id,
                      subjectName: peticion.to.name,
                      subjectId: null
                    }
                    EventLogService.log(eventLog);

                  })

                })
                return res.view({
                  locale: require(locales.es),
                  title: req.__('Proveedor.AgradecimientoTitle'),
                  message:  req.__('Proveedor.AgradecimientoMsn')
                });
              } else {
                return res.view({ 
                  locale: require(locales.es),
                  title: req.__('Proveedor.ErrorTitle'),
                  message:  req.__('Proveedor.ErrorMsn')});
              }
            })
          }
          
        } else {
          return res.view({
            locale: require(locales.es),
            title: req.__('Proveedor.ErrorTitle'),
            message:  req.__('Proveedor.ErrorMsn')});
        }
      }
    });
  }
}