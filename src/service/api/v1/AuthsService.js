var authDao = require('../../../dao/AuthsDao');
var logDao = require('../../../dao/LogDao');



const Log = function ( deviceType, deviceId, msg) {
    this.eventType = 'security';
    this.deviceType = deviceType;
    this.deviceId = deviceId;
    this.msg = msg;
};

const successMsg = "authentication success.";
const failureMsg = "authentication failure.";

function getAllAuths(callback) {
  authDao.selectAllAuth(callback);
}

function getAuthByDid(did, callback) {
    authDao.selectAuthByDid(did, callback);
}

function insertAuth(auth, callback) {
    authDao.insertAuth(auth, callback);
}

function insertDummyData(callback) {
    authDao.insertDummyData(callback);
}

function authInitService() {
    authDao.selectAllAuth(function (err, result) {
        if (err) {
            console.log('err selecet auth');
        }
        else {
            result.forEach(function(item, index) {
                var log;
                if (item.auth === 0) {
                    log = new Log(item.type, item.did, failureMsg);
                }
                else if (item.auth === 1){
                    log = new Log(item.type, item.did, successMsg);
                }
                else {
                    console.log('???Error');
                }
                logDao.insert(log, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {

                    }
                })
            })
        }
    })
}



function policyApplyInitServicer() {

}

module.exports = {
    getAllAuths : getAllAuths,
    getAuthByDid : getAuthByDid,
    insertAuth: insertAuth,
    insertDummyData: insertDummyData,
    authInitService: authInitService,
    policyApplyInitServicer, policyApplyInitServicer
};