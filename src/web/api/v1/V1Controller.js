var router = require('express').Router();

router.use('/gateways', require('./GatewayController'));
router.use('/devices', require('./DeviceController'));

router.use('/demo', require('./DemoContoller'));

module.exports = router;
