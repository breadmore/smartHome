var logger = require('log4js').getLogger('SensorLogDao.js');
var db = require('../components/DataBaseComponent');


module.exports = {
    listSensorLogsInPage: listSensorLogsInPage,
    updateRoomState: updateRoomState,
    searchLatestStateByDeviceId: searchLatestStateByDeviceId,
    searchLatestRoomState: searchLatestRoomState,
    insertSensorLog: insertSensorLog
}


// list sensor logs in page by offset and page ordered by id desc.
// todo: check what if offset is 0.
function listSensorLogsInPage(offset, page) {
    let sql = 'SELECT * FROM sensor_log ORDER BY id DESC LIMIT ' + offset + ' OFFSEt ' + offset*(page-1);

    return db.searchAll(sql);
}


// update room_state.
function updateRoomState(room_state) {
    let sql = 'INSERT INTO sensor_log (room_state) VALUES (' + room_state + ')';

    db.insertOne(sql);
}


// search latest(ordered by id desc and select first) state by device id.
function searchLatestStateByDeviceId(device_id) {
    let sql = 'SELECT state FROM sensor_log WHERE device_id = "' + device_id + '" ORDER BY id DESC LIMIT 1';

    return db.searchOne(sql);
}


// search latest(ordered by id desc and select first) room_state.
function searchLatestRoomState() {
    let sql = 'SELECT room_state FROM sensor_log ORDER BY id DESC LIMIT 1';

    return db.searchOne(sql);
}


// insert one sensor log.
function insertSensorLog(sensorJsonObj) {
    let columns = ""; // 컬럼
    let datas = ''; // 데이터

    for (let key in sensorJsonObj) {
        columns += key + ',';

        // string or number distinction
        if (typeof (sensorJsonObj[key]) === 'string') {
            datas += '"' + sensorJsonObj[key] + '",';
        }
        else {
            datas += sensorJsonObj[key] + ',';
        }
    }

    // 마지막 ',' 빼기
    columns = columns.substr(0, columns.length - 1);
    datas = datas.substr(0, datas.length - 1);

    let sql = 'INSERT INTO sensor_log (' + columns + ') VALUES (' + datas + ')';

    db.insertOne(sql);
}

