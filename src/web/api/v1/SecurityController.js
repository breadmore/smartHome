var router = require('express').Router();
let logger = require('log4js').getLogger('SecurityController.js');

var securityService = require('../../../service/api/v1/SecurityService');

var policyService = securityService.policyService;
var entityService = securityService.entityService;
var roleService = securityService.roleService;
var tokenService = securityService.tokenService;
var resourceService = securityService.resourceService;


var logDao = require('../../../dao/LogDao');

var moment = require('moment');

/**
 * policy 1)-> fromID, ToID  => entityTbl -> selectNameById
 *        2)-> TokenId => tokenTbl -> selectRoleIdByTokenId => roleTbl ->
 *         selectResorueID&OperationById => ResourceTbl -> selectResourceByID
 *
 */
router.route('/')
    .get(function (req, res) {
        var security = [];
        securityService.selectAllPolicy(function(err, result){
            if(err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    })
    .post(function (req, res) {
        if (req.body.bulk) {
            securityService.insertBulkData.resource(function(err, result){
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    securityService.insertBulkData.policy(function(err, result) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        else {
                            securityService.insertBulkData.entity(function(err, result) {
                                if (err) {
                                    res.status(500).send(err);
                                }
                                else {
                                    res.status(201).send();
                                }
                            })
                        }
                    })
                }
            })
        }
        else {
            res.status(400).send();
        }
    })
    .put(function(req, res) {
       if (req.body) {
           var now = moment(Date.now()).format('YYYYMMDDHHmmss');
           // data.enforce_date, data.fromId, data.toId, data.resourceName, data.previous, data.operation]

           // enforcePoint: Policy Enforcement Point radio button value => Server, Device
           var log = {
               enforce_date: now,
               fromId: req.body.fromId,
               toId: req.body.toId,
               resourceName: req.body.resourceName,
               previous: undefined,
               operation: req.body.operation,
               enforcePoint: req.body.enforcePoint
           };

           // insert into securityLog set update_log
           // {
           //     edate: now,
           //     etype: "security",
           //     dtype: ,
           //     did: auth table -> ,
           //     msg: 'update operation ' + log.previous + ' to ' + log.operation + '.'
           // }
           var securityLog = {
               eventType: 'security',
               deviceType: req.body.fromId,
               deviceId: undefined,
               msg: undefined
           };

           // service 1
           policyService.update(now, req.body, function(err, result) {
               if (err) {
                   console.log(err);
                   res.status(500).send(err);
               }
               else {
                   console.log(result);
                   tokenService.selectByTokenId(req.body, function (err, result) {
                       if (err) {
                           res.status(500).send(err);
                       }
                       else{
                           var data = {RoleID: result[0].RoleID, op: req.body.operation};
                           console.log(data);
                           roleService.selectById(result[0].RoleID, function (err, result) {
                               if (err) {
                                   res.status(500).send(err);
                               }
                               else{
                                   console.log(result[0].Operation);
                                   log.previous = result[0].Operation;
                                   // securityLog.msg = 'update operation ' + log.previous + ' to ' + log.operation + '.';
                                   securityLog.msg = 'policy modification: resource('+ req.body.resourceName +'), modified operation(' + log.operation + ')';
                                   console.log(log);

                                   roleService.updateOperation(data, function (err, result) {
                                       if (err) {
                                           res.status(500).send(err);
                                       }
                                       else{
                                           console.log(log);
                                           // service 2
                                           logDao.insertPolicyLog(log, function(err, result){
                                                if (err) {
                                                    res.status(401).send(err);
                                                }
                                                else {

                                                    // service 3
                                                    // set did from auth table. use type(log.fromId)
                                                    securityService.selectAllDidByEid(log, function (err, result) {
                                                        if (err) {
                                                            res.status(500).send(err);
                                                        }
                                                        else {
                                                            securityLog.deviceId = result[0].did;
                                                             logDao.insert(securityLog, function (err, result) {
                                                                 if (err) {
                                                                     res.status(401).send(err);
                                                                 }
                                                                 else {
                                                                     res.status(200).send(result);
                                                                 }
                                                             });
                                                        }
                                                    });
                                                }
                                            });
                                       }
                                   })
                               }
                           });

                       }
                   })
               }
           })
       }

    });


router.use('/policies', require('./security/PolicyController'));
router.use('/entities', require('./security/EntityController'));
router.use('/resources', require('./security/ResourceController'));
router.use('/tokens', require('./security/TokenContoller'));
router.use('/roles', require('./security/RoleController'));

module.exports = router;