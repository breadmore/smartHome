var db = require('../db/gui');
var moment = require('moment');
/**
 *
 CREATE TABLE `humidities` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `value` float NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=11715 DEFAULT CHARSET=utf8;

 CREATE TABLE `illuminations` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `value` int(11) NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`)
 )

 CREATE TABLE `temperatures` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `value` float NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`)
 )

 */


var Environment = {
    insertTemperature: function (value, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into temperatures (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    },
    insertHumidity: function (value, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into humidities (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    },
    insertIllumination: function (value, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into illuminations (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    },

    selectRecentTemperature: function (count, callback) {
        return db.query('select * from temperatures order by id desc limit ?', [count], callback);
    },
    selectRecentHumidity: function (count, callback) {
        return db.query('select * from humidities order by id desc limit ?', [count], callback);
    },
    selectRecentIllumination: function (count, callback) {
        return db.query('select * from illuminations order by id desc limit ?', [count], callback);
    },

    // selectRecentTemperature: function

    getAllById: function (id, callback) {
        return db.query('', callback)
    }
};

module.exports = Environment;