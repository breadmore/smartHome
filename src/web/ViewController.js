var router = require('express').Router();
var logger = require('log4js').getLogger("page.js");
var fs = require('fs');
var path = require('path');

// router.get('/*', function (req, res, next) {
//     // logger.debug(new Date().toString());
//     res.setHeader('Last-Modified', (new Date()).toString());
//     res.setHeader('Date', (new Date()).toString());
//     next();
// });

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', function (req, res) {
    const videoPath = path.join(__dirname, "../../resource/public/video");


    fs.readdir(videoPath, function (err, files) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('dashboard', {topics: files});
    });
    // res.render('dashboard');
});

router.get('/regist', function (req, res) {
    res.render('regist');
});

router.get('/device_security', function (req, res) {
    res.render('device_security');
});

// router.get('/gateway', function (req, res) {
//     res.render('gateway');
// });
//
// // router.get('/iotdevices', function (req, res) {
// //     res.render('iotdevice');
// // });
// //
// // router.get('/security', function (req, res) {
// //     res.render('security');
// // });

router.get('/account', function (req, res) {
    res.render('account');
});

router.get('/logger', function (req, res) {
    res.render('logger');
});



router.get('/m', function (req, res) {
    res.render('mobile/index');
});

router.get('/m/dashboard', function (req, res) {
    res.render('mobile/dashboard');
});

router.get('/m/regist', function (req, res) {
    res.render('mobile/regist');
});

router.get('/m/gateway', function (req, res) {
    res.render('mobile/gateway');
});

router.get('/m/devices', function (req, res) {
    res.render('mobile/device');
});

router.get('/m/security', function (req, res) {
    res.render('mobile/security');
});

router.get('/m/account', function (req, res) {
    res.render('mobile/account');
});

router.get('/m/ipcamera', function (req, res) {
    res.render('mobile/ipcamera');
});

router.get('/m/control', function (req, res) {
    res.render('mobile/control');
});

/////////////////////////////////////////////////

router.get('/new', function (req, res) {
    res.render('new/index');
});

router.get('/new/dashboard', function (req, res) {
    res.render('new/dashboard');
});

router.get('/new/regist', function (req, res) {
    res.render('new/regist');
});

router.get('/new/gateway', function (req, res) {
    res.render('new/gateway');
});

router.get('/new/iotdevices', function (req, res) {
    res.render('new/iotdevice');
});

router.get('/new/security', function (req, res) {
    res.render('new/security');
});

router.get('/new/account', function (req, res) {
    res.render('new/account');
});

router.get('/chart', function (req, res) {
    res.render('chart');
});

module.exports = router;



