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
//
// var magnetLog;
// var motionLog;
// var plugState;

const Log = function (msg, type, event) {
    this.eventType = 'log';
    this.msg = msg;
    this.type = type;
    this.event = event;
};

var magnetLog;
var motionLog;
var plugState;

var magnetState;
var motionState;


var heartbeatService = {};

var readAckService = function (type, data, callback) {
    switch (type) {
        case 'plug':
            // Mark : concerned connected state with on // off status..
            var log = new Log('', type, data.status);
            app.clientSocket('/xiaomi/states', log);
            callback(null, null);
            break;
        case 'magnet':
            var log = new Log('', type, data.status);
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
            // var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            var log;
            if (plugState === undefined || plugState !== data.status) {
                if (plugState === undefined || plugState === 'on') {
                    log = new Log('plug outlet is turned off.', type, data.status);
                }
                else {
                    log = new Log('plug outlet is turned on.', type, data.status)
                }
                plugState = data.status;
                // logDao.insertLog(log, callback);
                app.clientSocket('/xiaomi/states', log);
                logDao.insert(log, callback);
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
            // var log = new LogObject(GROUP_NAME, type, data.status, 'info');
            // if (magnetLog === undefined) {
            //     magnetLog = log;
            // }
            // if (magnetLog !== log ) {
            //     logDao.insertLog(magnetLog, callback);
            //     magnetLog = undefined;
            //     // notify dashboard
            //     app.clientSocket('/xiaomi/states', log);
            // }
            // else {
            //     callback(null, null);
            // }
            var log;
            if (magnetState === undefined) {
                magnetState = data.status;
            }
            else if (magnetState !== data.status) {
                if (magnetState === 'open') {
                    log = new Log('window is closed.', type, data.status);
                }
                else {
                    log = new Log('window is opened.', type, data.status);
                }
                app.clientSocket('/xiaomi/states', log);
                magnetState = data.status;
                logDao.insert(log, callback);
            }
            else {
                callback(null, null);
            }

            break;
        case 'motion':
            console.log(data);
            console.log(motionState);
            if (data.no_motion) {
                if (motionState === undefined) {
                    motionState = 'no_motion';
                }
                if (motionState !== 'no_motion') {
                    var log = new Log('motion is disappeared.', type, 'no_motion');
                    logDao.insert(log);
                    app.clientSocket('/xiaomi/states', log);
                    motionState = undefined;
                }
                else {
                    callback(null, null);
                }
            }
            else {
                var log = new Log('motion is detected.', type, data.status);
                logDao.insert(log, callback);
                app.clientSocket('/xiaomi/states', log);
                motionState = data.status;
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