var userDao = require('../../../dao/UserDao');

function selectAllUsers(callback) {
    userDao.selectAllUsers(callback);
}

function addUser(user, callback) {
    userDao.insert(user, callback);
}



function deleteUserByUserId(user,callback){
    userDao.deleteUserByUserId(user,callback);
}

function updateUserByUserId(user,callback){
    userDao.updateUserByUserId(user,callback);
}

module.exports = {
    selectAllUsers: selectAllUsers,
    addUser: addUser,
    deleteUserByUserId:deleteUserByUserId,
    updateUserByUserId:updateUserByUserId
};