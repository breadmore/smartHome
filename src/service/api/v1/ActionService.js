var actionDao = require('../../../dao/ActionDao');
var logDao = require('../../../dao/LogDao');
var stateDao = require('../../../dao/StatesDao');

function insert(action, callback){
    console.log(action);
    actionDao.insert(action, function (err, result) {
        if (err) {
            callback(err, null);
        }
        else {
            if (action.type == 1) {
                if (action.turnOn == 1) {
                    stateDao.ledOn(callback);
                }
                else if (action.turnOn == 0) {
                    stateDao.ledOff(callback);
                }
            }
            else if (action.type == 2) {
                if (action.turnOn == 1) {
                    stateDao.setOccupiedMode(callback);
                }
                else if (action.turnOn == 0) {
                    stateDao.setOutingMode(callback);
                }
            }
            else {
                callback("ActionType Error!", null);
            }
        }
    });
}

function insertLog(log, callback) {
    // logDao.insertLog(log, callback);
    callback(null,'insert Log');
}


module.exports = {
    insert: insert,
    insertLog: insertLog
};