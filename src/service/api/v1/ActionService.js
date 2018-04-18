var actionDao = require('../../../dao/ActionDao');
var logDao = require('../../../dao/LogDao');

function insert(action, callback){
    actionDao.insert(action, callback);
}

function insertLog(log, callback) {
    logDao.insertLog(log, callback);
}


module.exports = {
    insert: insert,
    insertLog: insertLog
};