var db = require('../db/gui');
var moment = require('moment');

var User = {
    getAllUser: function (callback) {
        return db.query('', callback);
    },
    getAllById: function(id, callback) {
        return db.query('', callback)
    },
    addUser: function(user, callback) {
        return db.query('',[user.id, user.pwd, user.authority], callback );
    },
    deleteUser: function(user, callback) {
        return db.query('',)
    },
    updateUserPwd: function(user, callback) {
        return db.query('', callback);
    }
};


module.exports = User;