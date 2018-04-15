var authDao = require('../../../dao/AuthsDao')


function getAllAuths(callback) {
  authDao.getAllAuths(callback);
}

module.exports = {
    getAllAuths : getAllAuths
};