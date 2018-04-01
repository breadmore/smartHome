var logger = require('log4js').getLogger('DeviceDao.js');
var db = require('../components/DataBaseComponent');


module.exports = {
    searchAllDevices: searchAllDevices,
    searchOneDeviceBySid: searchOneDeviceBySid,
    insertDevice: insertDevice,
    deleteOneDeviceBySid: deleteOneDeviceBySid,
    updateOneDeviceBySid: updateOneDeviceBySid
}


// search all devices records.
function searchAllDevices() {
    let sql = 'SELECT * FROM device';

    return db.searchAll(sql);
}


// search one device record by sid.
function searchOneDeviceBySid(sid) {
    let sql = 'SELECT * FROM device WHERE sid = "' + sid + '"';

    return db.searchOne(sql);
}


// update one device record by sid
function updateOneDeviceBySid(sid, deviceJsonObj) {
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
    let sql = 'UPDATE device SET ' + str + ' WHERE sid = "' + sid + '"';

    db.updateOne(sql);
}


// delete one device record by sid.
function deleteOneDeviceBySid(sid) {
    let sql = 'DELETE FROM device WHERE sid = "' + sid + '"';

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

