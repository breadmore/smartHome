var router = require('express').Router();

router.use('/gateways', require('./GatewayController'));
router.use('/devices', require('./DeviceController'));
router.use('/environments', require('./EnvironmentController'));

router.use('/states', require('./StateController'));
router.use('/xiaomi', require('./XiaomiController'));

router.use('/security', require('./SecurityController'));
router.use('/action', require('./ActionController'));
router.use('/users', require('./UserController'));
router.use('/logs', require('./LogController'));



/** Test Controller*/
router.use('/demo', require('./DemoContoller'));

module.exports = router;

