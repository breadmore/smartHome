
var db = require('../../db/gui');
/**
 CREATE TABLE `test`.`ResourceIDTbl` (
 `ID` VARCHAR(32) NULL DEFAULT NULL,
 `Type` VARCHAR(32) NULL DEFAULT NULL,
 `Resource` VARCHAR(64) NULL DEFAULT NULL);

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


var Resource = {
    insertResource: function (data, callback) {
        return db.query('insert into ResourceIDTbl (ID, Type, Resource) values ?, ?, ?'
            , [data.id, data.type, data.resource]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into ResourceIDTbl (ID, Type, Resource) values ?';
        var values = [
            ['0', 'remoteCSE', '/'],
            ['1', 'contentInstance', '/CSE-ID'],
            ['2', 'AE', '/ThermoHygrometer_1'],
            ['3', 'contentInstance', '/ThermoHygrometer_1/AE-ID'],
            ['4', 'contentInstance', '/ThermoHygrometer_1/Values'],
            ['5', 'AE', '/SmartLight_2'],
            ['6', 'contentInstance', '/SmartLight_2/AE-ID'],
            ['7', 'contentInstance', '/SmartLight_2/Values']
        ];
        return db.query(sql, [values], callback);
    },

    selectAll: function(callback) {
        return db.query('select * from ResourceIDTbl', callback);
    },
    selectById: function(id, callback) {
        return db.query('select * from ResourceIDTbl where ID = ?', id, callback);
    }
};

module.exports = Resource;