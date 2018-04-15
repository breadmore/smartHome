
var db = require('../../db/security');
/**
 mysql> desc ResourceIDTbl;
 +----------+-------------+------+-----+---------+-------+
 | Field    | Type        | Null | Key | Default | Extra |
 +----------+-------------+------+-----+---------+-------+
 | ID       | varchar(32) | YES  |     | NULL    |       |
 | Type     | varchar(32) | YES  |     | NULL    |       |
 | Resource | varchar(64) | YES  |     | NULL    |       |
 +----------+-------------+------+-----+---------+-------+

 +------+-----------------+----------------------------+
 | ID   | Type            | Resource                   |
 +------+-----------------+----------------------------+
 | 0    | remoteCSE       | /                          |
 | 1    | contentInstance | /CSE-ID                    |
 | 2    | AE              | /ThermoHygrometer_1        |
 | 3    | contentInstance | /ThermoHygrometer_1/AE-ID  |
 | 4    | contentInstance | /ThermoHygrometer_1/Values |
 | 5    | AE              | /SmartLight_2              |
 | 6    | contentInstance | /SmartLight_2/AE-ID        |
 | 7    | contentInstance | /SmartLight_2/Values       |
 +------+-----------------+----------------------------+
 */


var Environment = {

};

module.exports = Environment;