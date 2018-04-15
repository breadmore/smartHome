var db = require('../db/gui');
var moment = require('moment');
let logger = require('log4js').getLogger('LogDao.js');
/**
 CREATE TABLE `event_log` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `device_group` INT NOT NULL,
 `device_type` VARCHAR(45) NOT NULL,
 `event` VARCHAR(256) NOT NULL,
 `level` VARCHAR(45) NOT NULL,
 `created_at` DATETIME NOT NULL
 PRIMARY KEY (`id`));
 */

var Log = {
    insertLog: function (log, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        logger.debug("insert log :");
        logger.debug(log);

        return db.query('insert into event_log (device_group, device_type, event, level, created_at) values (?, ?, ?, ?, ?)'
            , [log.group, log.type, log.event, log.level, now]
            , callback);
    },

    selecetAllLog: function(callback) {
        return db.query('select * from event_log', callback);
    },

    selectXiaomiLog: function (callback) {
        return db.query('select * from event_log where device_group = xiaomi', callback)
    },

};

module.exports = Log;