var router = require('express').Router();
let logger = require('log4js').getLogger('GatewayController.js');
/**
 * get all gateway information.
 */
router.route('/')
    .get(function (req, res) {

    })
    .post(function (req, res) {

    });


/**
 * get router information.
 */
router.route('/:gatewayId')
    .get(function (req, res) {
        logger.debug('/api/v1/gateway/{gatewayId} ', req.params.gatewayId);
    });

module.exports = router;