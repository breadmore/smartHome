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
    return logDao.selectRecentServiceLog(callback);
}

function selectRecentDeployLog(callback) {
    logDao.selectRecentDeployLog(callback);
}

function selectAllServiceLog(callback) {
    return logDao.selectAllServiceLog(callback);
}

function selectAllDeployLog(callback) {
    logDao.selectAllDeployLog(callback);
}

function selectAuthsEid(did, callback){
    logDao.selectAuthsEid(did, callback);
}

module.exports = {
    insertLog: insert,
    selectRecentSecurityLog: selectRecentSecurityLog,
    selectRecentDeployLog:selectRecentDeployLog,
    selectAllSecurityEvent:selectAllSecurityEvent,
    selectRecentServiceLog:selectRecentServiceLog,
    selectAllDeployLog:selectAllDeployLog,
    selectAllServiceLog:selectAllServiceLog,
    selectAuthsEid:selectAuthsEid
};