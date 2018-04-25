let logger = require('log4js').getLogger('XiaomiService.js');
var app = require('../../../server');

const Log = function (msg, type, event) {
    this.eventType = 'log';
    this.msg = msg;
    this.type = type;
    this.event = event;
};


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
            var log = new Log('plug outlet report service!', type, data.status);
            app.clientSocket('/xiaomi/states', log);
            callback(null, null);
            break;
        case 'switch':
            console.log(data);
            callback(null, null);
            break;
        case 'magnet':
            var log = new Log('magnet report service', type, data.status);
                app.clientSocket('/xiaomi/states', log);

                callback(null, null);
            break;
        case 'motion':
            if (data.no_motion) {
                    var log = new Log('motion is disappeared.', type, 'no_motion');
                    app.clientSocket('/xiaomi/states', log);
                    callback(null, null);
            }
            else {
                var log = new Log('motion is detected.', type, data.status);
                app.clientSocket('/xiaomi/states', log);
                callback(null, null);
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