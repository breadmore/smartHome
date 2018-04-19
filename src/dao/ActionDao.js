var db = require('../db/gui');
var moment = require('moment');

/**
 CREATE TABLE `actions` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `ip` varchar(255) NOT NULL,
 `action_type` int(11) NOT NULL,
 `turn_on` tinyint(1) NOT NULL,
 `created_at` datetime NOT NULL,
 `updated_at` datetime NOT NULL,
 PRIMARY KEY (`id`)
 )
 */

var Action = {
    insert: function (data, callback) {
        var now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        return db.query('insert into actions (ip, action_type, turn_on, created_at, updated_at) values (?, ?, ?, ?, ?)'
            , [data.ip, data.type, data.turnOn, now, now]
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
    }
};

module.exports = Action;