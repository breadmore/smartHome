var router = require('express').Router();
let logger = require('log4js').getLogger('SecurityController.js');

var securtyService = require('../../../service/api/v1/SecurityService');

router.route('/')
    .get(function (req, res) {

    })
    .post(function (req, res) {
        if (req.body.bulk) {
            securtyService.insertBulkData.resource(function(err, result){
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    securtyService.insertBulkData.policy(function(err, result) {
                        if (err) {
                            res.status(500).send(err);
                        }
                        else {
                            securtyService.insertBulkData.entity(function(err, result) {
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

module.exports = router;