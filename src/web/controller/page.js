var router = require('express').Router();


router.route('/')
    .get(function (req, res) {
        res.render('index');
    });

router.route('/regist')
    .get(function (req, res) {
        res.render('regist');
    });
router.route('/dashboard')
    .get(function (req, res) {
        res.render('dashboard');
    });
router.route('/gateway')
    .get(function (req, res) {
        res.render('gateway');
    });
router.route('/iotdevices')
    .get(function (req, res) {
        res.render('iotdevice');
    });
router.route('/security')
    .get(function (req, res) {
        res.render('security');
    });
router.route('/account')
    .get(function (req, res) {
        res.render('account');
    });
module.exports = router;



