var logDao = require('../../../dao/LogDao');


function insert(log, callback) {
    return logDao.insert(log, callback);
}

function selectRecentAllLog(callback) {
    return logDao.selectAllEvent(callback);
}

function selectDeployAllLog(callback) {
    return logDao.selectAllSecurityEvent(callback);
}


function updateState(state, callback) {
    // return stateDao.updateState(state, callback);
}

function selectAllUsers(callback) {
    logDao.selectAllUsers(callback);
}


module.exports = {
    insertLog: insert,
    selectRecentAllLog: selectRecentAllLog,
    selectAllUsers:selectAllUsers,
    selectDeployAllLog:selectDeployAllLog
};