var db = require('../../db/security');
/**
  CREATE TABLE `test`.`RoleIDTbl` (
 `ID` VARCHAR(32) NULL,
 `ResourceID` VARCHAR(32) NULL,
 `Operation` VARCHAR(16) NULL);
 */

var Role = {
    insert: function (data, callback) {
        return db.query('insert into RoleIDTbl (ID, ResourceID, Operation) values ?, ?, ?'
            , [data.id, data.resourceID, data.Operation]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into RoleIDTbl (ID, ResourceID, Operation) values ?';
        var values = [
            ['1', '2', 'CRUDN'],
            ['2', '5', 'CRUDN']
        ];
        return db.query(sql, [values], callback);
    },

    selectAll: function(callback) {
        return db.query('select * from RoleIDTbl', callback);
    },
    selectByResourceId: function(resourceId, callback) {
        return db.query('select * from RoleIDTbl where ID = ?', resourceId, callback);
    }
};

module.exports = Role;