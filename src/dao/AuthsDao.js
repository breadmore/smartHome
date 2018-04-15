var db = require('../db/gui');

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
 */


var Auths = {
    getAllAuths: function (callback) {
        return db.query('select * from auths', callback);
    },
    getAllById: function(id, callback) {
        return db.query('', callback)
    }
};

module.exports = Auths;
