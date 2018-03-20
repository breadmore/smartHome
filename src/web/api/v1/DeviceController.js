var router = require('express').Router();
let logger = require('log4js').getLogger('DeviceGateway.js');

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

    });


router.route('/:deviceId')
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

    });

module.exports = router;