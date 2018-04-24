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
    selecthourTemperature: function (value, callback) {
        return db.query('SELECT date\n' +
            ', hour\n' +
            '    , min * '+ value.min +'\n' +
            '    , valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT DATE(created_at) AS date\n' +
            '    , HOUR(created_at) AS hour\n' +
            '    , FLOOR(MINUTE(created_at) / '+ value.min +') AS min\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM temperatures\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL '+ value.hour +' hour)\n' +
            'GROUP BY DATE(created_at), HOUR(created_at), FLOOR(MINUTE(created_at) / '+ value.min +')\n' +
            ') A\n' +
            'ORDER BY HOUR, MIN ASC', callback);
    },
    selecthourHumidities: function (value, callback) {
        return db.query('SELECT date\n' +
            ', hour\n' +
            '    , min * '+ value.min +'\n' +
            '    , valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT DATE(created_at) AS date\n' +
            '    , HOUR(created_at) AS hour\n' +
            '    , FLOOR(MINUTE(created_at) / '+ value.min +') AS min\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM humidities\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL '+ value.hour +' hour)\n' +
            'GROUP BY DATE(created_at), HOUR(created_at), FLOOR(MINUTE(created_at) / '+ value.min +')\n' +
            ') A\n' +
            'ORDER BY HOUR, MIN ASC', callback);
    },
    selecthourIlluminations: function (value, callback) {
        return db.query('SELECT date\n' +
            ', hour\n' +
            '    , min * '+ value.min +'\n' +
            '    , valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT DATE(created_at) AS date\n' +
            '    , HOUR(created_at) AS hour\n' +
            '    , FLOOR(MINUTE(created_at) / '+ value.min +') AS min\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM illuminations\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL '+ value.hour +' hour)\n' +
            'GROUP BY DATE(created_at), HOUR(created_at), FLOOR(MINUTE(created_at) / '+ value.min +')\n' +
            ') A\n' +
            'ORDER BY HOUR, MIN ASC', callback);
    },
    selectdayTemperature: function (value, callback) {
        return db.query('SELECT year\n' +
            ', month\n' +
            '    , day\n' +
            '    , ROUND(valueAvg,2) as valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT YEAR(created_at) AS year\n' +
            '    , MONTH(created_at) AS month\n' +
            '    , FLOOR(DAY(created_at) / 1) AS day\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM temperatures\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL 1 MONTH)\n' +
            'GROUP BY YEAR(created_at), MONTH(created_at), FLOOR(DAY(created_at)/1)\n' +
            ') A\n' +
            'ORDER BY year, month, day ASC;', callback);
    },
    selectdayHumidities: function (value, callback) {
        return db.query('SELECT year\n' +
            ', month\n' +
            '    , day\n' +
            '    , ROUND(valueAvg,2) as valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT YEAR(created_at) AS year\n' +
            '    , MONTH(created_at) AS month\n' +
            '    , FLOOR(DAY(created_at) / 1) AS day\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM humidities\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL 1 MONTH)\n' +
            'GROUP BY YEAR(created_at), MONTH(created_at), FLOOR(DAY(created_at)/1)\n' +
            ') A\n' +
            'ORDER BY year, month, day ASC;', callback);
    },
    selectdayIlluminations: function (value, callback) {
        return db.query('SELECT year\n' +
            ', month\n' +
            '    , day\n' +
            '    , ROUND(valueAvg,2) as valueAvg\n' +
            '    , count\n' +
            ' FROM (\n' +
            'SELECT YEAR(created_at) AS year\n' +
            '    , MONTH(created_at) AS month\n' +
            '    , FLOOR(DAY(created_at) / 1) AS day\n' +
            '    , avg(value) AS valueAvg\n' +
            '    , count(*) AS count\n' +
            'FROM illuminations\n' +
            'WHERE created_at > DATE_SUB(now(),INTERVAL 1 MONTH)\n' +
            'GROUP BY YEAR(created_at), MONTH(created_at), FLOOR(DAY(created_at)/1)\n' +
            ') A\n' +
            'ORDER BY year, month, day ASC;', callback);
    },
    // selectRecentTemperature: function

    getAllById: function (id, callback) {
        return db.query('', callback)
    }
};

module.exports = Environment;