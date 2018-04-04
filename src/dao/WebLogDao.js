var logger = require('log4js').getLogger('WebLogDao.js');
var db = require('../components/DataBaseComponent');


module.exports = {
    searchAllWebLogs: searchAllWebLogs
}


// search all web_logs records.
function searchAllWebLogs() {
    let sql = 'SELECT * FROM web_log';

    return db.searchAll(sql);
}

