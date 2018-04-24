var db = require('../../db/security');
/**
 CREATE TABLE `test`.`TokenIDTbl` (
 `ID` VARCHAR(16) NULL,
 `RoleID` VARCHAR(32) NULL);
 */


var Token = {
    insert: function (data, callback) {
        return db.query('insert into TokenIDTbl (ID, RoleID) values ?, ?'
            , [data.id, data.roleID]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into TokenIDTbl (ID, RoleID) values ?';
        var values = [
            ['591732613', '1'],
            ['1852533209', '2']
        ];
        return db.query(sql, [values], callback);
    },

    selectAll: function(callback) {
        return db.query('select * from TokenIDTbl', callback);
    },
    selectById: function(id, callback) {
        return db.query('select * from TokenIDTbl where ID = ?', id, callback);
    },
    selectByTokenId: function (body, callback) {
        return db.query('select * from TokenIDTbl where ID = ?', body.tokenId, callback);
    }
};

module.exports = Token;


