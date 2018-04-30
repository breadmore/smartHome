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
            ['12965934', 'AAAABBBBCCCCDDDD', '0.2.481.1.10.100.3030.10011.65934', 1, 0, 1, 1, 0, 0, 'kitchen', '12965901', now, now],
            ['12965936', 'EEEEFFFFGGGGHHHH', '0.2.481.1.10.100.3030.10011.65936', 2, 0, 2, 1, 1, 1, 'kitchen', '12965901', now, now],
            ['12965938', '1111222233334444', '0.2.481.1.10.100.3030.10011.65938', 3, 0, 3, 1, 1, 0, 'living room', '12965901', now, now],
            ['12965940', '5555666677778888', '0.2.481.1.10.100.3030.10011.65940', 4, 0, 4, 1, 1, 1, 'main room', '12965901', now, now],
            ['12965942', 'aaaabbbbccccdddd', '0.2.481.1.10.100.3030.10011.65942', 5, 0, 5, 1, 0, 0, 'entrance', '12965901', now, now],
            ['12965944', 'eeeeffffgggghhhh', '0.2.481.1.10.100.3030.10011.65944', 6, 0, 6, 1, 1, 1, 'window', '12965901', now, now],
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
    },

    deleteDeviceById: function (id,callback) {
        return db.query('delete from auths where id = ?',
            id,
            callback);
    },
    /**
     * deleteGateway
     */
    // deleteGatewayByDId: function (did,callback) {
    //     return db.query('delete from auths where did = ?',
    //         did,
    //         callback);
    // },
    updateDeviceById: function (id, callback) {
        // return db.query('update auths set gwid = ?, eid = ?, type =? , did = ?, dname = ?, psk = ?, oid = ?, sid = ? where id = ?',
        //     [did.gwid, did.eid, did.type, did.did, did.dname, did.psk, did.oid, did.sid, did.id],
        //     callback);
        /**
         * 영훈
         conn, auth, reg 버튼 구현 후 아래 주석으로 실행
         */
        return db.query('update auths set gwid = ?, eid = ?, type =? , did = ?, dname = ?, psk = ?, oid = ?, sid = ?,con = ?, auth=?,reg=? where id = ?',
            [did.gwid, did.eid, did.type, did.did, did.dname, did.psk, did.oid, did.sid, did.id],
            callback);
    },
};

module.exports = Auths;
