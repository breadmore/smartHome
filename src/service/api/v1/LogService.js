var logDao = require('../../../dao/LogDao');


function insert(log, callback) {
    return logDao.insert(log, callback);
}

function selectRecentSecurityLog(callback) {
    return logDao.selectRecentSecurityEvent(callback);
}

function selectAllSecurityEvent(callback) {
    return logDao.selectAllSecurityEvent(callback);
}


function updateState(state, callback) {
    // return stateDao.updateState(state, callback);
}

function selectRecentServiceLog(callback) {
    return logDao.selectAllServiceLog(callback);
}

function selectRecentDeployLog(callback) {
    logDao.selectRecentDeployLog(callback);
}

function selectAllDeployLog(callback) {
    logDao.selectAllDeployLog(callback);
}

module.exports = {
    insertLog: insert,
    selectRecentSecurityLog: selectRecentSecurityLog,
    selectRecentDeployLog:selectRecentDeployLog,
    selectAllSecurityEvent:selectAllSecurityEvent,
    selectRecentServiceLog:selectRecentServiceLog,
    selectAllDeployLog:selectAllDeployLog
};