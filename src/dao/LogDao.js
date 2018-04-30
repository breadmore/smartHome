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


/**
 * CREATE TABLE `test`.`Policy_History` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `enforce_date` DATETIME NOT NULL,
 `from_id` INT NOT NULL,
 `to_id` INT NOT NULL,
 `resource_name` VARCHAR(45) NOT NULL,
 `pre_operation` VARCHAR(45) NULL,
 `current_operation` VARCHAR(45) NULL,
 PRIMARY KEY (`id`));
 */

/**
 * CREATE TABLE `test`.`Security_Log` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `event_date` DATETIME NOT NULL,
 `event_type` VARCHAR(45) NOT NULL,
 `device_type` INT(11) NULL,
 `device_id` VARCHAR(45) NULL,
 `msg` VARCHAR(256) NULL,
 PRIMARY KEY (`id`));

 */

var Log = {

    //todo : it will be not used.. remove.
    insertLog: function (log, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into event_log (device_group, device_type, event, level, created_at) values (?, ?, ?, ?, ?)'
            , [log.group, log.type, log.event, log.level, now]
            , callback);
    },

    insert: function(log, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into Security_Log (event_date, event_type, device_type, device_id, msg) values (?, ?, ?, ?, ? )',
            [now, log.eventType, log.deviceType, log.deviceId, log.msg],
            callback);

    },

    insertModifyLog: function(log, callback) {
        return db.query('insert into Security_Log (event_date, event_type, device_type, device_id, msg) values (?, ?, ?, ?, ? )',
            [log.eventDate, log.eventType, log.deviceType, log.deviceId, log.msg],
            callback);
    },

    // selectAllSecurityEvent(callback) {
    //     return db.query('select * from Security_Log where event_type = "security" or event_type = "critical"',
    //         callback);
    // },

    selectRecentSecurityEvent(callback) {
        return db.query('select * from Security_Log where event_type = "security" or event_type = "critical" order by id desc limit 10', callback);
    },

    selectRecentServiceLog(callback) {
        return db.query('select * from Security_Log where event_type = "service" or event_type = "log" order by id desc limit 10', callback);
    },

    selectAllServiceLog(callback) {
        return db.query('select * from Security_Log where event_type = "service" or event_type = "log"', callback);
    },

    // Mark : PolicyHistory Dao.
    insertPolicyLog: function(data, callback) {
        // console.log(data);
        return db.query('insert into Policy_History (enforce_date, from_id, to_id, resource_name, pre_operation, current_operation) values (?, ?, ?, ?, ?, ?)',
            [data.enforce_date, data.fromId, data.toId, data.resourceName, data.previous, data.operation],
            callback);
    },

    selectAllDeployLog: function(callback) {
        return db.query('select * from Policy_History',callback);
    },

    selectRecentDeployLog: function(callback) {
        return db.query('select * from Policy_History order by id desc limit 10',callback);
    },



    selectById: function(data, callback){

    },

    selecetAllLog: function(callback) {
        return db.query('select * from event_log', callback);
    },

    selectXiaomiLog: function (callback) {
        return db.query('select * from event_log where device_group = xiaomi', callback)
    }

};

module.exports = Log;