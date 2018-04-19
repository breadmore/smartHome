var router = require('express').Router();
let logger = require('log4js').getLogger('DashboardController.js');

var actionService = require('../../../service/api/v1/ActionService');

router.route('/')
/**
 * get all devices information.
 */
    .get(function (req, res) {

    })
    /**
     * add device.
     */
    .post(function (req, res) {
        res.status(200).send(req.body);
        // actionService.insert(req.body, function(err, result){
        //     if (err) {
        //         res.status(400).send(err);
        //     }
        //     else {
        //         res.status(202).send(result);
        //     }
        // });
    });


router.route('/log')
/**
 * get device information.
 */
    .get(function (req, res) {
        logger.debug('/api/v1/gateway/{gatewayId} ', req.params.gatewayId);
    })
    /**
     *
     */
    .post(function (req, res) {
        res.status(200).send(req.body);
        // actionService.insertLog(req.body, callback);
    });

module.exports = router;