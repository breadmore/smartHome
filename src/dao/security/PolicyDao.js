var db = require('../../db/security');
/**

 CREATE TABLE `test`.`PolicyIDTbl` (
 `ID` VARCHAR(32) NULL DEFAULT NULL,
 `FromID` VARCHAR(16) NULL DEFAULT NULL,
 `ToID` VARCHAR(16) NULL DEFAULT NULL,
 `TokenID` VARCHAR(16) NULL DEFAULT NULL);

 mysql> desc PolicyIDTbl;
 +---------+-------------+------+-----+---------+-------+
 | Field   | Type        | Null | Key | Default | Extra |
 +---------+-------------+------+-----+---------+-------+
 | ID      | varchar(32) | YES  |     | NULL    |       |
 | FromID  | varchar(16) | YES  |     | NULL    |       |
 | ToID    | varchar(16) | YES  |     | NULL    |       |
 | TokenID | varchar(16) | YES  |     | NULL    |       |
 +---------+-------------+------+-----+---------+-------+
 4 rows in set (0.00 sec)

 mysql> SELECT * FROM PolicyIDTbl;
 +----------------------+--------+------+------------+
 | ID                   | FromID | ToID | TokenID    |
 +----------------------+--------+------+------------+
 | 20180411180936372147 | 1      | 0    | 591732613  |
 | 20180412143820801807 | 2      | 0    | 1852533209 |
 +----------------------+--------+------+------------+
 2 rows in set (0.00 sec)

 */


var Policy = {
    insert: function (data, callback) {
        return db.query('insert into PolicyIDTbl (ID, FromID, ToID, TokenID) values ?, ?, ?, ?'
            , [data.id, data.name, data.status, data.tokenId]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into PolicyIDTbl (ID, FromID, ToID, TokenID) values ?';
        var values = [
            ['20180411180936372147', '1', '0', '591732613'],
            ['20180412143820801807', '2', '0', '1852533209']
        ];
        return db.query(sql, [values], callback);
    },

    selectAll: function(callback) {
        return db.query('select * from PolicyIDTbl', callback);
    },
    selectById: function(id, callback) {
        return db.query('select * from PolicyIDTbl where ID = ?', id, callback);
    }
};

module.exports = Policy;