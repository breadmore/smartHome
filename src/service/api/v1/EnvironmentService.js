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

function getHourTemperature(value, callback) {
    environmentDao.selecthourTemperature(value, callback);
}

function getHourHumidity(value, callback) {
    environmentDao.selecthourHumidities(value, callback);
}

function getHourIllumination(value, callback) {
    environmentDao.selecthourIlluminations(value, callback);
}

function getDayTemperature(value, callback) {
    environmentDao.selectdayTemperature(value, callback);
}

function getDayHumidity(value, callback) {
    environmentDao.selectdayHumidities(value, callback);
}

function getDayIllumination(value, callback) {
    environmentDao.selectdayIlluminations(value, callback);
}

module.exports = {
    insertEnvironments : insertEnvironments,
    getLastTemperature : getLastTemperature,
    getLastHumidity : getLastHumidity,
    getLastIlluminaty : getLastIlluminati,
    getHourTemperature : getHourTemperature,
    getHourHumidity : getHourHumidity,
    getHourIllumination : getHourIllumination,
    getDayTemperature : getDayTemperature,
    getDayHumidity : getDayHumidity,
    getDayIllumination : getDayIllumination
};
