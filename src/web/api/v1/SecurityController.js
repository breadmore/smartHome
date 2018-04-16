var router = require('express').Router();
let logger = require('log4js').getLogger('SecurityController.js');

var securityService = require('../../../service/api/v1/SecurityService');

var policyService = securityService.policyService;
var entityService = securityService.entityService;
var roleService = securityService.roleService;
var tokenService = securityService.tokenService;
var resourceService = securityService.resourceService;


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
    });


router.use('/policies', require('./security/PolicyController'));
router.use('/entities', require('./security/EntityController'));
router.use('/resources', require('./security/ResourceController'));
router.use('/tokens', require('./security/TokenContoller'));
router.use('/roles', require('./security/RoleController'));

module.exports = router;