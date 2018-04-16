var environmentDao = require('../../../dao/EnvironmentDao');
let logger = require('log4js').getLogger('EnvironmentService.js');
var app = require('../../../server');

function insertEnvironments(type, value, callback) {
    switch (type) {
        case 'temperature':
            environmentDao.insertTemperature(value, callback);
            break;
        case 'humidity':
            environmentDao.insertHumidity(value, callback);
            break;
        default:
            break;
    }
}

function getLastTemperature(count, callback) {
    environmentDao.selectRecentTemperature(count, callback);
}

function getLastHumidity(count, callback) {
    environmentDao.selectRecentHumidity(count, callback);
}

function getLastIlluminati(count, callback) {
    environmentDao.selectRecentIllumination(count, callback);
}

module.exports = {
    insertEnvironments : insertEnvironments,
    getLastTemperature : getLastTemperature,
    getLastHumidity : getLastHumidity,
    getLastIlluminaty : getLastIlluminati
};
