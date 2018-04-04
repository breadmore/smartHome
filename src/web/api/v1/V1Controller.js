var router = require('express').Router();

router.use('/gateways', require('./GatewayController'));
router.use('/devices', require('./DeviceController'));

router.use('/demo', require('./DemoContoller'));
router.use('/db', require('./DbTestController'));

module.exports = router;

