/**
 * CREATE TABLE `test`.`gui_user` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `user_id` VARCHAR(256) NOT NULL,
 `password` VARCHAR(256) NOT NULL,
 `authority` VARCHAR(45) NOT NULL,
 `user_name` VARCHAR(45) NOT NULL,
 `email` VARCHAR(45) NULL,
 `phone_number` VARCHAR(45) NULL,
 `created_at` DATETIME NOT NULL,
 `updated_at` DATETIME NOT NULL,
 PRIMARY KEY (`id`, `user_id`));
 */




var db = require('../db/gui');
var moment = require('moment');

var User = {
    insert: function(user, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into gui_user (user_id, password, authority, user_name, email, phone_number, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?)',
            [user.userId, user.password, user.authority, user.name, user.email, user.phone, now, now],
            callback)
    },

    selectUserByUserId: function (user, callback) {
        // console.log(user.userId);
        return db.query('select * from gui_user where user_id = ?',
            user.userId,
            callback);
    },

    selectAllUsers: function(callback) {
        return db.query('select * from gui_user', callback);
    },

    updateUserByUserId: function (user, callback) {
        return db.query('update gui_user set password = ?, authority = ?, user_name =? , email = ?, phone_number = ? where user_id = ?',
            [user.password,user.authority, user.user_name,user.email, user.phone_number, user.user_id],
            callback);
    },

    deleteUserByUserId: function (user,callback) {
        return db.query('delete from gui_user where user_id = ?',
            user.id,
            callback);
    }

};


module.exports = User;