var db = require('../db/gui');
var moment = require('moment');

/**
 * Auths Table
 CREATE TABLE `auths` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `eid` int(11) NOT NULL,
 `oid` varchar(255) NOT NULL,
 `psk` blob NOT NULL,
 `iot_type` int(11) NOT NULL,
 `conn` int(11) NOT NULL,
 `auth` int(11) NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`),
 KEY `index_auths_on_eid` (`eid`) USING BTREE
 ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

 CREATE TABLE `auths` (

 ==> 수정 0416
 CREATE TABLE `auths` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `did` char(8) DEFAULT NULL,
 `psk` binary(16) DEFAULT NULL,
 `oid` varchar(255) DEFAULT NULL,
 `eid` int(11) DEFAULT NULL,
 `sid` int(11) DEFAULT NULL,
 `type` int(11) DEFAULT NULL,
 `conn` int(11) DEFAULT NULL,
 `auth` int(11) DEFAULT NULL,
 `reg` int(11) DEFAULT NULL,
 `dname` varchar(32) DEFAULT NULL,
 `gwid` char(8) DEFAULT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `index_auths_on_eid` (`eid`) USING BTREE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
 */


var Auths = {
    insertAuth: function (auth, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        console.log(auth);
        return db.query('insert into auths (did, psk, oid, eid, sid, type, conn, auth, reg, dname, gwid, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            , [auth.did, auth.psk, auth.oid, auth.eid, auth.sid, auth.type, auth.conn, auth.auth, auth.reg, auth.dname, auth.gwid, now, now]
            , callback);
    },
    insertDummyData: function (callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var sql = 'insert into auths (did, psk, oid, eid, sid, type, conn, auth, reg, dname, gwid, created_at, updated_at) values ?';
        var values = [
            ['12965934', 'AAAABBBBCCCCDDDD', null, 0, 0, 1, 0, 0, 0, 'kitchen', '12965901', now, now],
            ['12965936', 'EEEEFFFFGGGGHHHH', null, 0, 0, 2, 0, 0, 0, 'kitchen', '12965901', now, now],
            ['12965938', '1111222233334444', null, 0, 0, 3, 0, 0, 0, 'living room', '12965901', now, now],
            ['12965940', '5555666677778888', null, 0, 0, 4, 0, 0, 0, 'main room', '12965901', now, now],
            ['12965942', 'aaaabbbbccccdddd', null, 0, 0, 5, 0, 0, 0, 'entrance', '12965901', now, now],
            ['12965944', 'eeeeffffgggghhhh', null, 0, 0, 6, 0, 0, 0, 'window', '12965901', now, now],
        ];
        return db.query(sql, [values], callback);
    },

    selectAllAuth: function(callback) {
        return db.query('select * from auths', callback);
    },

    selectAuthByDid: function(did, callback) {
        return db.query('select * from auths where did = ?', did, callback);
    },

    selectAllDidByEid: function (data, callback) {
        return db.query('select * from auths where eid = ?', Number(data.fromId), callback);
    }
};

module.exports = Auths;
