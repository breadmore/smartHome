var db = require('../../db/security');

/**
 CREATE TABLE `test`.`EntityIDTbl` (
 `ID` VARCHAR(64) NULL DEFAULT NULL,
 `Name` VARCHAR(64) NULL DEFAULT NULL,
 `Status` VARCHAR(64) NULL DEFAULT NULL,
 `TokenID` VARCHAR(64) NULL DEFAULT NULL);

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

var Entity = {
    insertEntity: function (entity, callback) {
        return db.query('insert into EntityIDTbl (ID, Name, Status, TokenID) values ?, ?, ?, ?'
            , [entity.id, entity.name, entity.status, entity.tokenId]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into EntityIDTbl (ID, Name, Status, TokenId) values ?';
        var values = [
            ['0', 'MyIoTSVR', 'localhost', null],
            ['1', 'ThermoHygrometer_1', null, '591732613'],
            ['2', 'SmartLight_2', null, '1852533209']
        ];
        return db.query(sql, [values], callback);
    },

    selectAll: function(callback) {
        return db.query('select * from EntityIDTbl', callback);
    },
    selectById: function(id, callback) {
        return db.query('select * from EntityIDTbl where ID = ?', id, callback);
    }
};

module.exports = Entity;