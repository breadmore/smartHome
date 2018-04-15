var db = require('../../db/security');

/**
 mysql> desc EntityIDTbl;
 +---------+-------------+------+-----+---------+-------+
 | Field   | Type        | Null | Key | Default | Extra |
 +---------+-------------+------+-----+---------+-------+
 | ID      | varchar(64) | YES  |     | NULL    |       |
 | Name    | varchar(32) | YES  |     | NULL    |       |
 | Status  | varchar(32) | YES  |     | NULL    |       |
 | TokenID | varchar(32) | YES  |     | NULL    |       |
 +---------+-------------+------+-----+---------+-------+
 4 rows in set (0.00 sec)

 mysql> SELECT * FROM EntityIDTbl;
 +------+--------------------+-----------+------------+
 | ID   | Name               | Status    | TokenID    |
 +------+--------------------+-----------+------------+
 | 0    | MyIoTSVR           | localhost | -          |
 | 1    | ThermoHygrometer_1 |           | 591732613  |
 | 2    | SmartLight_2       |           | 1852533209 |
 +------+--------------------+-----------+------------+
 3 rows in set (0.00 sec)
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