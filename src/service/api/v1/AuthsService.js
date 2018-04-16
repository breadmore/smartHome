var authDao = require('../../../dao/AuthsDao');


function getAllAuths(callback) {
  authDao.selectAllAuth(callback);
}

function getAuthByDid(did, callback) {
    authDao.selectAuthByDid(did, callback);
}

function insertAuth(auth, callback) {
    authDao.insertAuth(auth, callback);
}

function insertDummyData(callback) {
    authDao.insertDummyData(callback);
}

module.exports = {
    getAllAuths : getAllAuths,
    getAuthByDid : getAuthByDid,
    insertAuth: insertAuth,
    insertDummyData: insertDummyData

};