var db = require('../db/gui');
var moment = require('moment');

/**
 * CREATE TABLE `test`.`gateway` (
 `id` VARCHAR(8) NOT NULL,
 `name` VARCHAR(64) NOT NULL,
 `ip` VARCHAR(256) NOT NULL,
 `port` INT(8) NOT NULL,
 `conn` TINYINT(1) NULL,
 PRIMARY KEY (`id`));
 */

var Gateway = {
    // insertTemperature: function (value, callback) {
    //     var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //     return db.query('insert into temperatures (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    // },
    // insertHumidity: function (value, callback) {
    //     var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //     return db.query('insert into humidities (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    // },
    // insertIllumination: function (value, callback) {
    //     var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    //     return db.query('insert into illuminations (value, created_at, updated_at) values (?, ?, ?)', [value, now, now], callback);
    // },
    //
    // selectRecentTemperature: function (count, callback) {
    //     return db.query('select * from temperatures order by id desc limit ?', [count], callback);
    // },
    // selectRecentHumidity: function (count, callback) {
    //     return db.query('select * from humidities order by id desc limit ?', [count], callback);
    // },
    // selectRecentIllumination: function (count, callback) {
    //     return db.query('select * from illuminations order by id desc limit ?', [count], callback);
    // },

    // selectRecentTemperature: function

    insert: function (gateway, callback) {
        return db.query('insert into gateway (id, name, ip, port, conn) values (?, ?, ?, ?, ?)',
            [gateway.id, gateway.name, gateway.ip, gateway.port, gateway.conn],
            callback);
    },

    insertDummy: function (callback) {
        var sql = 'insert into gateway (id, name, ip, port, conn) values ?';
        var values = [
            ['12965901', 'Gateway_Room', '192.168.0.200', 3000, 1],
            ['12965902', 'Gateway_Living', '192.168.0.201', 3000, 1]
        ];
        return db.query(sql, [values], callback);
    },

    findAll: function (callback) {
        return db.query('select * from gateway', callback);
    },

    findById: function (id, callback) {
        return db.query('select * from gateway where id = ?', id, callback);
    },

    update: function (id, gateway, callback) {

        return db.query('update gateway set name = ?, ip = ? port = ? conn = ? where id = ?',
            [gateway.name, gateway.ip, gateway.port, gateway.conn, id],
            callback)
    },
    searchName: function(name, callback) {
        return db.query('select * from gateway where name like "%' + name + '%"', callback);
    },

    getPolicy: function(id, callback) {
        return db.query('select a.eid, e.TokenID, t.RoleID, r.Operation from auths as a left join EntityIDTbl as e on a.eid = e.ID left join TokenIDTbl as t on e.TokenID = t.ID left join RoleIDTbl as r on t.RoleID = r.ID where a.eid = ' + id + '', callback);
    },

    deleteById: function (id, callback) {
        return db.query('delete  from gateway where id = ?', id, callback);
    },

    searchDevice: function (id, callback) {
        return db.query('select a.did, a.conn, a.auth, a.type, a.eid from auths as a left join gateway as g on a.gwid = g.id where a.did like "%' + id + '%"', callback);
    }

};

module.exports = Gateway;