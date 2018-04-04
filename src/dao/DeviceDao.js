var logger = require('log4js').getLogger('DeviceDao.js');
var db = require('../components/DataBaseComponent');


module.exports = {
    listDevicesInPage: listDevicesInPage,
    listDevicesByType: listDevicesByType,
    searchOneDeviceById: searchOneDeviceById,
    updateOneDeviceById: updateOneDeviceById,
    deleteOneDeviceById: deleteOneDeviceById,
    insertDevice: insertDevice
}


// list devices in page by offset and page ordered by id asc.
// todo: check what if offset is 0.
function listDevicesInPage(offset, page) {
    let sql = 'SELECT * FROM device ORDER BY id ASC LIMIT ' + offset + ' OFFSET ' + offset*(page-1);

    return db.searchAll(sql);
}


//list devices by type ordered by id asc.
function listDevicesByType(type) {
    let sql = 'SELECT * FROM device WHERE type = "' + type + '" ORDER BY id ASC'

    return db.searchAll(sql);
}


// search one device record by sid.
function searchOneDeviceById(id) {
    let sql = 'SELECT * FROM device WHERE id = "' + id + '"';

    return db.searchOne(sql);
}


// update one device record by sid
function updateOneDeviceById(id, deviceJsonObj) {
    let str = "";

    for (let key in deviceJsonObj) {
        // string or number distinction
        if (typeof (deviceJsonObj[key]) === 'string') {
            str += key + ' = "' + deviceJsonObj[key] + '", ';
        }
        else {
            str += key + ' = ' + deviceJsonObj[key] + ', ';
        }
    }

    str = str.substr(0, str.length - 2);
    let sql = 'UPDATE device SET ' + str + ' WHERE id = "' + id + '"';

    db.updateOne(sql);
}


// delete one device record by sid.
function deleteOneDeviceById(id) {
    let sql = 'DELETE FROM device WHERE id = "' + id + '"';

    db.deleteOne(sql);
}


// insert one device record.
function insertDevice(deviceJsonObj) {
    let columns = ""; // 컬럼
    let datas = ''; // 데이터

    for (let key in deviceJsonObj) {
        columns += key + ',';

        // string or number distinction
        if (typeof (deviceJsonObj[key]) === 'string') {
            datas += '"' + deviceJsonObj[key] + '",';
        }
        else {
            datas += deviceJsonObj[key] + ',';
        }
    }

    // 마지막 ',' 빼기
    columns = columns.substr(0, columns.length - 1);
    datas = datas.substr(0, datas.length - 1);

    let sql = 'INSERT INTO device (' + columns + ') VALUES (' + datas + ')';

    db.insertOne(sql);
}

