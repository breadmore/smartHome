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

function selectAllSecurityEvent(callback) {
    return logDao.selectAllSecurityEvent(callback);
}


function updateState(state, callback) {
    // return stateDao.updateState(state, callback);
}

function selectRecentDeployLog(callback) {
    logDao.selectRecentDeployLog(callback);
}


module.exports = {
    insertLog: insert,
    selectRecentAllLog: selectRecentAllLog,
    selectRecentDeployLog:selectRecentDeployLog,
    selectDeployAllLog:selectDeployAllLog,
    selectAllSecurityEvent:selectAllSecurityEvent
};