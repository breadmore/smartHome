var db = require('../db/gui');

/**
 CREATE TABLE `actions` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `ip` varchar(255) NOT NULL,
 `action_type` int(11) NOT NULL,
 `turn_on` tinyint(1) NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`)
 )
 */

var Action = {
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

module.exports = Action;