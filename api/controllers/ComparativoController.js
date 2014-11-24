/**
 * ComparativoController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash');
var excelbuilder = require('msexcel-builder');
var slug = require('slug')

module.exports = {

  getAll: function(req, res) {
    Comparativo.getAllFromUser(req.user.id, function(err, comparativos){
      if(err) return res.negotiate(err)
      //Comparativo.subscribe(req.socket, comps);
      res.json(comparativos)
    })
  },

  getOne: function(req, res) {
    Comparativo.getOne(req.param('id'), function(err, comparativo){
      if(err) return res.negotiate(err)
      Comparativo.subscribe(req.socket, comparativo)
      return res.json(comparativo)  
    })
  },

  update: function (req, res) {
    var id = req.param('id')
    if (!id) {
      return res.badRequest('No id provided.')
    }

    // Otherwise, find and EDIT the model in question
    Comparativo.findOne(id).exec(function(err, comparativo) {
      if (err) {
        sails.log.warning('comparativos:edit:getComparativo:error', {err: err});
        return res.serverError(err);
      }
      if (!comparativo) return res.notFound()

      if(comparativo.peticiones.length>0) return res.badRequest('Already sent.')

      if(!req.body) return res.badRequest('No content provided.')
      
      var updatedComp = req.body
      if(updatedComp.id) delete updatedComp.id

      Comparativo.update(id, updatedComp, function(err, updatedomparativo) {
        if (err) {
          sails.log.warning('comparativos:edit:error', {err: err});
          return res.serverError(err);
        }
        var eventLog  = {
          obra: comparativo.obra,
          service: 'comparativo',
          action: 'edit',
          objectName: comparativo.title,
          objectId: comparativo.id,
          subjectName: req.user.first_name + ' '+ req.user.last_name,
          subjectId: req.user.id
        }
        EventLogService.log(eventLog);
        Comparativo.publishUpdate(comparativo.id, comparativo);
        Comparativo.findOne(comparativo.id).populate('peticiones').exec(function(err,full){

          return res.json(full);
        })

      });
    });
  },

  create: function (req, res) {
    var userId = req.user.id;
    var model = req.body;
    model.tmpOwnId = userId
    Comparativo.create(model)
    .exec(function(err, comparativo) {
      if (err) {
        sails.log.warning('comparativos:create:error', {err: err});
        return sails.serverError(err)
      }
      else {
        var eventLog  = {
          obra: comparativo.obra,
          service: 'comparativo',
          action: 'create',
          objectName: comparativo.title,
          objectId: comparativo.id,
          subjectName: req.user.first_name + ' '+ req.user.last_name,
          subjectId: req.user.id
        }
        EventLogService.log(eventLog);

        Obra.findOne(comparativo.obra).exec(function(err, obra){
          if(!err){
            comparativo.obra = obra;
            Comparativo.publishCreate(comparativo);
            res.json(comparativo);
          } else {
            return res.negotiate(err)
          }
        })
      }
    });
  },

  destroy: function (req, res) {
    var id = req.param('id');
    if (!id) {
      return res.badRequest('No id provided.');
    }

    // Otherwise, find and destroy the model in question
    Comparativo.findOne(id).exec(function(err, comparativo) {
      if (err) {
        sails.log.warning('comparativos:destroy:getComparativo:error', {err: err});
        return res.serverError(err);
      }
      if (!comparativo) {
        return res.notFound();
      }

      Comparativo.update(id,{deleted:true}, function(err) {
        if (err) {
          sails.log.warning('comparativos:destroy:error', {err: err});
          return res.serverError(err);
        }
        var eventLog  = {
          obra: comparativo.obra,
          service: 'comparativo',
          action: 'delete',
          objectName: comparativo.title,
          objectId: comparativo.id,
          subjectName: req.user.first_name + ' '+ req.user.last_name,
          subjectId: req.user.id
        }
        EventLogService.log(eventLog);
        Comparativo.publishUpdate(comparativo.id);
        return res.json(comparativo);
      });
    });
  },

  download: function(req, res) {
    if(!req.params.id){
      return res.send(400);
    } else {
      Comparativo.getOne(req.params.id, function(err, comparativo){
        var cols = 20;
        comparativo.peticiones.forEach(function(item,index){
          // console.log(item.respuestas)
          cols++;
        })

        //var excelbuilder = require('msexcel-builder');
        // Create a new workbook file in current working-path
        var workbook = excelbuilder.createWorkbook('./.tmp/', slug(comparativo.title)+'.xlsx')
        // Create a new worksheet with x columns and y rows
        var sheet1 = workbook.createSheet(comparativo.title, cols, comparativo.content.length+75);

        for(var i=1;i<comparativo.content.length+51;i++){
          sheet1.height(i, 20);
        }

        sheet1.width(1, 10);
        sheet1.width(2, 50);

        for(var i=1;i<cols;i++){
          sheet1.width(i, 15);
        }      
        // conf del sheet, formato de columnas, filas etc.. 
        // poblar el sheet
        sheet1.set(2, 1, 'Obra:');
        sheet1.font(2, 1, {bold:'true'});
        sheet1.set(3, 1, comparativo.obra.title);
        sheet1.border(2,1, {bottom:'thin'});
        sheet1.border(3,1, {bottom:'thin'});
        // sheet1.set(1, 3, 'Adjudicación de:');
        // sheet1.font(1, 3, {bold:'true'});
        // sheet1.set(2, 4, comparativo.title);
        sheet1.set(2, 3, 'Jefe de Obra:');
        sheet1.font(2, 3, {bold:'true'});
        sheet1.set(3, 3, req.user.first_name);  
        sheet1.border(2,3, {bottom:'thin'});
        sheet1.border(3,3, {bottom:'thin'});
        sheet1.set(2, 5, 'Fecha:');
        sheet1.font(2, 5, {bold:'true'});
        var d = new Date();
        var nDay = d.getDate();
        var nMoth = d.getMonth();
        var nYear = d.getFullYear();
        var fecha = nDay + '/' + nMoth + "/" + nYear;
// !! ------> change this to spanish date format!
        sheet1.set(2, 5, fecha);  
        sheet1.border(3,5, {bottom:'thin'});
        sheet1.border(2,5, {bottom:'thin'});       

        var c = 5;
        var r = 10;
      comparativo.peticiones.forEach(function(item,index){
        sheet1.set(c, r, item.to.name)
        sheet1.font(c, r, {bold:'true'});
        sheet1.border(c, r, {left:'medium',top:'medium',right:'thin',bottom:'thin'});
        sheet1.border(c+1, r, {left:'medium',top:'medium',right:'medium',bottom:'thin'});
        //sheet1.fill(c, r, {type:'solid',fgColor:'1',bgColor:'11'});
        sheet1.merge({col:c,row:r},{col:c+1,row:r});
        sheet1.set(c, r+1, 'Precio')
        sheet1.border(c, r+1, {left:'medium',top:'none',right:'thin',bottom:'medium'});
        //sheet1.fill(c, r+1, {type:'solid',fgColor:'1',bgColor:'11'});
        sheet1.set(c+1, r+1, 'Importe')
        //sheet1.fill(c+1, r+1, {type:'solid',fgColor:'1',bgColor:'11'});
        sheet1.border(c+1, r+1, {left:'none',top:'none',right:'medium',bottom:'medium'});

        console.log(item.respuestas)
        var index = 0;
        var total = 0;
        if(item.respuestas[0]){
          Object.keys(item.respuestas[0].content).forEach(function(key) {
            var val = item.respuestas[0].content[key];
            sheet1.set(c, r+2+index, val[0])
            total+=val[0]*comparativo.content[index].quantity;
            sheet1.set(c+1, r+2+index, val[0]*comparativo.content[index].quantity)  
            sheet1.border(c+1, r+2+index, {left:'thin',top:'none',right:'medium',bottom:'thin'});       

            index++;
          });
        }
        sheet1.set(c+1, r+2+index, total.toFixed(2))
        sheet1.font(c+1, r+2+index, {bold:'true'});
        sheet1.border(c+1, r+2+index, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
        
        c+=2;
      })        


      sheet1.set(2, 11, 'Ud');
      sheet1.border(2, 11, {left:'medium',top:'medium',right:'thin',bottom:'medium'});

      sheet1.set(3, 11, 'Descripción');
      sheet1.border(3, 11, {left:'thin',top:'medium',right:'thin',bottom:'medium'});      

      sheet1.set(4, 11, 'Med. Real');
      sheet1.border(4, 11, {left:'thin',top:'medium',right:'thin',bottom:'medium'});  

        var cc = 12;
        comparativo.content.forEach(function(item,index){
          sheet1.set(2, cc, item.unit)
          sheet1.set(3, cc, item.concept)
          sheet1.set(4, cc, item.quantity)
          cc++;
        })
      sheet1.set(4,cc+2, 'Forma de Pago');
      sheet1.border(4, cc+2, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
      var ccc = cc+2;
      var r = 5;
       comparativo.peticiones.forEach(function(item,index){
          if(item.respuestas[0]){
            sheet1.set(r, ccc, item.respuestas[0].formaPago)
            r =r+2;
          }
        })
        workbook.save(function(err){
          if (err) 
            workbook.cancel();
          else
            sails.log.info('xlsx:created');
            // res.end(workbook)
            // console.log(workbook)
            return res.download(workbook.fpath+workbook.fname);
        });
      })
    }
  },
  downloadFile: function(req, res){
    if(req.param('fileUrl')){
      var file = req.param('fileUrl')
      // TODO: Asegurar de que hay una respuesta con esta fileUrl que pertenece a un comparativo que pertenece a una obra del cual el user sea owner
      S3.sign( 'getObject', file , null,function(err, signed){
        if(err) return res.serverError(err)
        return res.json(signed)
      })
    }
  }
};