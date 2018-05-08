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
// const failureMsg = "authentication failure.";

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

function deleteDeviceById(id,callback) {
    authDao.deleteDeviceById(id,callback);
}

function updateDeviceById(id,callback){
    authDao.updateDeviceById(id,callback);
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
                    // log = new Log(item.type, item.did, failureMsg);
                    // logDao.insert(log, function (err, result) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    //     else {
                    //
                    //     }
                    // })
                }
                else if (item.auth === 1){
                    log = new Log(item.type, item.did, successMsg);
                    logDao.insert(log, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {

                        }
                    })
                }
                else {
                    console.log('???Error');
                }
            })
        }
    })
}

function compareEntityId(entityId, policyDataList) {
    var msg = null;
    policyDataList.forEach(function (policyData, index) {
        if(policyData.EntityID == entityId){
            //resouce 자리에 EntityId 테이블의 '/' + Name + '_' + auths.did 인가?
            msg = 'policy enforcement: resource(' + policyData.Resouce + '), operation(' + policyData.Operation + ')';
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
            console.log(policyDataList);
            authDao.selectAllAuth(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else{
                    result.forEach(function (authRow, index) {
                        msg = compareEntityId(authRow.eid, policyDataList);
                        if(msg === null){
                            // msg = 'Not applied policy.';
                        }
                        else {
                            securityLog = {
                                eventDate: authRow.updated_at,
                                eventType: 'security',
                                deviceType: authRow.eid,
                                deviceId: authRow.did,
                                msg: msg
                            };
                            logDao.insertModifyLog(securityLog, function (err, result) {
                                if (err) {
                                    console.log();
                                }
                                else {
                                    console.log(result);
                                }
                            });
                        }
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
    policyApplyInitServicer, policyApplyInitServicer,
    deleteDeviceById:deleteDeviceById,
    updateDeviceById:updateDeviceById
};