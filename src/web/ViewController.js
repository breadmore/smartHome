var router = require('express').Router();
var logger = require('log4js').getLogger("page.js");

router.get('/*', function(req, res, next){
    logger.debug(new Date().toString());
    // res.setHeader('Last-Modified', (new Date()).toString());
    // res.setHeader('Date', (new Date()).toString());
    next();
});

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

router.get('/regist', function (req, res) {
    res.render('regis');
});

router.get('/gateway', function (req, res) {
    res.render('gateway');
});

router.get('/iotdevices', function (req, res) {
    res.render('iotdevice');
});

router.get('/security', function (req, res) {
    res.render('security');
});

router.get('/account', function (req, res) {
    res.render('account');
});

module.exports = router;



