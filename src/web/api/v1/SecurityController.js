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

           var log = {
               enforce_date: now,
               fromId: req.body.fromId,
               toId: req.body.toId,
               resourceName: req.body.resourceName,
               previous: undefined,
               operation: req.body.operation
           };
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
                                   console.log(log);
                                   roleService.updateOperation(data, function (err, result) {
                                       if (err) {
                                           res.status(500).send(err);
                                       }
                                       else{
                                           console.log(log);
                                            logDao.insertPolicyLog(log, function(err, result){
                                                if (err) {
                                                    res.status(401).send(err);
                                                }
                                                else {
                                                    res.status(200).send(result);
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