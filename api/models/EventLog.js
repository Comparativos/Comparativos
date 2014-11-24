/**
* EventLog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    obra:{ model:'obra' },
    obraName: 'string',
    comparativo: { model:'comparativo' },
    comparativoName: 'string',
    service: 'string',
    action: 'string',
    objectName:'string',
    objectId: 'string',
    subjectName: 'string',
    subjectId: 'string',

  }
};

