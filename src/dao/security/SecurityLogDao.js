/**
 * security policy log database.
 * todo : architect and impl...
 */
var db = require('../../db/gui');
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


var Security = {
    insertResource: function (data, callback) {
        return db.query('insert into ResourceIDTbl (ID, Type, Resource) values ?, ?, ?'
            , [data.id, data.type, data.resource]
            , callback);
    },

    insertDummyData: function(callback) {
        var sql = 'insert into ResourceIDTbl (ID, Type, Resource) values ?';
        var values = [
            ['0', 'remoteCSE      ', '/'],
            ['1', 'contentInstance', '/CSE-ID'],
            ['2', 'AE             ', '/ThermoHygrometer_1'],
            ['3', 'contentInstance', '/ThermoHygrometer_1/AE-ID'],
            ['4', 'contentInstance', '/ThermoHygrometer_1/Values'],
            ['5', 'AE             ', '/SmartLight_2'],
            ['6', 'contentInstance', '/SmartLight_2/AE-ID'],
            ['7', 'contentInstance', '/SmartLight_2/Values']
        ];
        return db.query(sql, [values], callback);
    },

    selectAllSecurityPolicy: function(callback) {
        return db.query('SELECT RESOURCE.TokenID AS TokenID\n' +
            ', RESOURCE.RoleID AS RoleID\n' +
            '    , IF(INSTR(RESOURCE.Operation, \'C\')>0, \'Y\', \'N\') AS CreationYn\n' +
            '    , IF(INSTR(RESOURCE.Operation, \'R\')>0, \'Y\', \'N\') AS ReadYn\n' +
            '    , IF(INSTR(RESOURCE.Operation, \'U\')>0, \'Y\', \'N\') AS UpdateYn\n' +
            '    , IF(INSTR(RESOURCE.Operation, \'D\')>0, \'Y\', \'N\') AS DeleteYn\n' +
            '    , IF(INSTR(RESOURCE.Operation, \'N\')>0, \'Y\', \'N\') AS NotifyYn\n' +
            '    , RESOURCE.Operation AS Operation\n' +
            '    , RESOURCE.ResourceID AS ResourceID\n' +
            '    , RESOURCE.Resouce AS Resouce\n' +
            '    , RESOURCE.ResourceType AS ResourceType\n' +
            ', EIT.ID AS EntityID\n' +
            '    , EIT.name AS EntityName\n' +
            '    , EIT.Status AS EntityStatus\n' +
            ', PIT.ID AS policyID\n' +
            '    , PIT.FromID AS FromID\n' +
            '    , PIT.ToID AS ToID\n' +
            ' FROM (\n' +
            'SELECT TRIT.TokenID AS TokenID\n' +
            ', TRIT.RoleID AS RoleID\n' +
            ', TRIT.Operation AS Operation\n' +
            ', REIT.ID AS ResourceID\n' +
            ', REIT.Resource AS Resouce\n' +
            ', REIT.Type AS ResourceType\n' +
            ' FROM (\n' +
            'SELECT TIT.ID AS TokenID\n' +
            ', RIT.ID AS RoleID\n' +
            ', RIT.Operation AS Operation\n' +
            ', RIT.ResourceID AS ResourceID\n' +
            ' FROM TokenIDTbl TIT\n' +
            ', RoleIDTbl RIT\n' +
            'WHERE TIT.RoleID = RIT.ID\n' +
            ') TRIT\n' +
            ', ResourceIDTbl REIT\n' +
            'WHERE TRIT.ResourceID = REIT.ID\n' +
            '        ) RESOURCE\n' +
            ', PolicyIDTbl PIT\n' +
            ', EntityIDTbl EIT\n' +
            'WHERE RESOURCE.TokenID = EIT.TokenID\n' +
            '  AND RESOURCE.TokenID = PIT.TokenID', callback);
    },
    selectEntityById: function(id, callback) {
        return db.query('select * from ResourceIDTbl where ID = ?', id);
    }
};

module.exports = Security;