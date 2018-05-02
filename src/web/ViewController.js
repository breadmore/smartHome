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
    // res.render('dashboard', {
    //     userName : req.session.userName,
    //     authority : req.session.authority
    // });
    authCheck(req, res, "dashboard");
});

router.get('/regist', function (req, res) {
    res.render('regist');
});

// router.post('/regist', (req, res) => {
//     console.log(req.body);
//     userDao.insert(req.body, (err, result) => {
//         if (err) {
//             res.status(401).send(err);
//         }
//         else {
//             res.status(201).send(result);
//
//         }
//
//
//     })
// });
//
// router.post('/login', (req, res) => {
//    console.log(req.body);
//    // var test = userDao.selectUserByUserId(req.body);
//     userDao.selectUserByUserId(req.body, function (result) {
//         console.log(result);
//     });
//    // res.redirect('/', test);
// });

router.get('/device_security', function (req, res) {
    // res.render('device_security', {
    //     userName : req.session.userName,
    //     authority : req.session.authority
    // });
    authCheck(req, res, "device_security");
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
    // if (req.session.authority == undefined){
    //     res.redirect('/');
    // } else if (req.session.authority != undefined) {
    //     res.render('account', {
    //         userName : req.session.userName,
    //         authority : req.session.authority
    //     });
    // }
    // res.render('account', {
    //     userName : req.session.userName,
    //     authority : req.session.authority
    // });
    authCheck(req, res, "account");
});

router.get('/logger', function (req, res) {
    // res.render('logger', {
    //     userName : req.session.userName,
    //     authority : req.session.authority
    // });
    authCheck(req, res, "logger");

});



router.get('/m', function (req, res) {
    res.render('mobile/index');
    // authCheck(req,res, 'mobile/index');
});

router.get('/m/dashboard', function (req, res) {
    // res.render('mobile/dashboard');
    authCheck(req,res, 'mobile/dashboard');

});

router.get('/m/regist', function (req, res) {
    // res.render('mobile/regist');
    authCheck(req,res, 'mobile/regist');
});

router.get('/m/gateway', function (req, res) {
    // res.render('mobile/gateway');
    authCheck(req,res, 'mobile/gateway');
});

router.get('/m/devices', function (req, res) {
    // res.render('mobile/device');
    authCheck(req,res, 'mobile/device');
});

router.get('/m/security', function (req, res) {
    // res.render('mobile/security');
    authCheck(req,res, 'mobile/security');
});

router.get('/m/account', function (req, res) {
    // res.render('mobile/account');
    authCheck(req,res, 'mobile/account');
});

router.get('/m/ipcamera', function (req, res) {
    // res.render('mobile/ipcamera');
    authCheck(req,res, 'mobile/ipcamera');
});

router.get('/m/control', function (req, res) {
    // res.render('mobile/control');
    authCheck(req,res, 'mobile/control');
});

function authCheck(req, res, page) {
    if (req.session.authority == undefined){
        res.redirect('/');
    } else if (req.session.authority != undefined) {
        res.render(page, {
            userName : req.session.userName,
            authority : req.session.authority
        });
    }
}

module.exports = router;



