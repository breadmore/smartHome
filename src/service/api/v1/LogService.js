var logDao = require('../../../dao/LogDao');


function insert(log, callback) {
    return logDao.insert(log, callback);
}

function selectRecentAllLog(callback) {
    return logDao.selectAllEvent(callback);
}


function updateState(state, callback) {
    // return stateDao.updateState(state, callback);
}

module.exports = {
    insertLog: insert,
    selectRecentAllLog: selectRecentAllLog
};