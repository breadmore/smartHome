var userDao = require('../../../dao/UserDao');

function selectAllUsers(callback) {
    userDao.selectAllUsers(callback);
}

function addUser(user, callback) {
    userDao.insert(user, callback);
}


module.exports = {
    selectAllUsers: selectAllUsers,
    addUser: addUser
};