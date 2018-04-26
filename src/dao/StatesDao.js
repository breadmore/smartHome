var db = require('../db/gui');
var moment = require('moment');
/**
 CREATE TABLE `states` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `singleton_guard` int(11) DEFAULT NULL,
 `mode` int(11) DEFAULT NULL,
 `led` tinyint(1) DEFAULT NULL,
 `gas_blocker` tinyint(1) DEFAULT NULL,
 `gas_detector` tinyint(1) DEFAULT NULL,
 `human_detector` tinyint(1) DEFAULT NULL,
 `window_detector` tinyint(1) DEFAULT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `index_states_on_singleton_guard` (`singleton_guard`) USING BTREE
 )
 */

var States = {
    insertState: function (state, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into states (mode, led, gas_blocker, gas_detector, human_detector, window_detector, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?)'
            , [state.mode, state.led, state.gas_blocker, state.gas_detector, state.human_detector, state.window_detector, now, now]
            , callback);
    },

    updateState: function(state, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('update states set gas_blocker=?, gas_detector=?, human_detector=?, window_detector=?, updated_at=? where id=1'
        ,[state.gas_blocker, state.gas_detector, state.human_detector, state.window_detector, now]
        ,callback)
    },

    getLastState: function (callback) {
        return db.query('select * from states where id = 1',callback);
    },

    ledOff: function (callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('update states set led = 0, updated_at=? where id=1',
            [now],
            callback)
    },

    ledOn: function (callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('update states set led = 1, updated_at=? where id=1',
            [now],
            callback)
    },

    setOccupiedMode: function (callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('update states set mode = 0, updated_at=? where id=1',
            [now],
            callback)
    },

    setOutingMode: function (callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('update states set mode = 1, updated_at=? where id=1',
            [now],
            callback)
    }
};

module.exports = States;