var router = require('express').Router();

router.use('/gateways', require('./GatewayController'));
router.use('/devices', require('./DeviceController'));
router.use('/environments', require('./EnvironmentController'));

router.use('/states', require('./StateController'));
router.use('/xiaomi', require('./XiaomiController'));

router.use('/security', require('./SecurityController'));


/** Test Controller*/
router.use('/demo', require('./DemoContoller'));
router.use('/db', require('./DbTestController'));

module.exports = router;

