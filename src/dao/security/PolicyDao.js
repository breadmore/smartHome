var db = require('../../db/security');
/**
 *
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


var Environment = {

};

module.exports = Environment;