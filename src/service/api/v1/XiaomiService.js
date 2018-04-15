let logger = require('log4js').getLogger('XiaomiService.js');
var logDao = require('../../../dao/LogDao');
var app = require('../../../server');
const GROUP_NAME = 'Xiaomi';

const LogObject = function(group, type, event, level) {
    this.group = group;
    this.type = type;
    this.event = event;
    this.level = level;
};


var magnetLog;
var motionLog;
var plugState;

var heartbeatService = {
    aaa: function (a) {

    }
};

var readAckService = function (type, data, callback) {
    switch (type) {
        case 'plug':
            // Mark : concerned connected state with on // off status..
            console.log('service read_ack plug');
            var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            console.log(log);
            app.clientSocket('/xiaomi/states', log);
            callback(null, null);
            break;
        case 'magnet':
            console.log('service read_ack magnet');
            var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            console.log(log);
            app.clientSocket('/xiaomi/states', log);
            callback(null, null);
            break;
        case 'motion':
        case 'switch':
        default:
            console.log(type);
            console.log(data);
            callback(null, null);
            break;

    }
};



function reportService(type, data, callback) {
    switch (type) {
        case 'plug':
            var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            if (plugState === undefined || plugState !== data.status) {
                plugState = data.status;
                logDao.insertLog(log, callback);
                app.clientSocket('/xiaomi/states', log);
            }
            // else if () {
            //     plugState = data.status;
            //     logDao.insertLog(log, callback);
            //     app.clientSocket('/xiaomi/states', log);
            // }
            else if (plugState === data.state) {
                callback(null, null);
            }
            else {
                callback(null, null)
            }
            break;
        case 'switch':
            console.log(data);
            break;
        case 'magnet':
            var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            if (magnetLog === undefined) {
                magnetLog = log;
            }
            if (magnetLog !== log ) {
                logDao.insertLog(magnetLog, callback);
                magnetLog = undefined;
                // notify dashboard
                app.clientSocket('/xiaomi/states', log);
            }
            else {
                callback(null, null);
            }
            break;
        case 'motion':
            console.log(data);
            if(data.no_motion) {
                var log = new LogObject(GROUP_NAME, type, 'no_motion', 'info');
                if (motionLog === undefined) {
                    motionLog = log;
                }
                if (motionLog !== log) {
                    // insert log
                    logDao.insertLog(log, callback);
                    // notify dashboard
                    app.clientSocket('/xiaomi/states', log);
                    motionLog = undefined;
                }
                else {
                    callback(null, null);
                }
            }
            else {
                var log = new LogObject(GROUP_NAME, type, data.status, 'info');
                // insert log
                logDao.insertLog(log, callback);
                // notify dashboard
                app.clientSocket('/xiaomi/states', log);
            }
            break;
        default:
            console.log(type);
            console.log(data);
            callback(null, null);
            break;
    }
}


module.exports = {
    heartbeatService: heartbeatService,
    reportService: reportService,
    readAckService: readAckService
};