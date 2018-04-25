var authDao = require('../../../dao/AuthsDao');
var logDao = require('../../../dao/LogDao');
var securityLogDao = require('../../../dao/security/SecurityLogDao');



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

function getPolicy(policyData){
    var policy = '';
    if(policyData.CreationYn === 'Y'){
        policy += 'C';
    }
    if(policyData.ReadYn === 'Y'){
        policy += 'R';
    }
    if(policyData.UpdateYn === 'Y'){
        policy += 'U';
    }
    if(policyData.DeleteYn === 'Y'){
        policy += 'D';
    }
    if(policyData.NotifyYn === 'Y'){
        policy += 'N';
    }
    return policy;
}

function compareEntityId(entityId, policyDataList) {
    var msg = null;
    policyDataList.forEach(function (policyData, index) {
        if(policyData.EntityID == entityId){
            // console.log('apply ' + getPolicy(policyData));
            msg = 'apply ' + getPolicy(policyData);
        }
        else{
            // console.log('not apply.');
        }
    });
    return msg;
}

function policyApplyInitServicer() {
    var policyDataList;
    var msg;
    var securityLog;
    securityLogDao.selectAllSecurityPolicy(function (err, result) {
        if(err){
            console.log(err);
        }
        else{
            policyDataList = result;
            // console.log(policyDataList);
            authDao.selectAllAuth(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else{
                    result.forEach(function (authRow, index) {
                        msg = compareEntityId(authRow.eid, policyDataList);
                        if(msg === null){
                            msg = 'not apply.';
                        }
                        securityLog = {
                            eventType: 'security',
                            deviceType: authRow.eid,
                            deviceId: authRow.did,
                            msg: msg
                        };
                        logDao.insert(securityLog, function (err, result) {
                            if(err){
                                console.log();
                            }
                            else{
                                console.log(result);
                            }
                        });
                    });


                }
            })
        }
    });
}

module.exports = {
    getAllAuths : getAllAuths,
    getAuthByDid : getAuthByDid,
    insertAuth: insertAuth,
    insertDummyData: insertDummyData,
    authInitService: authInitService,
    policyApplyInitServicer, policyApplyInitServicer
};