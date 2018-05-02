var router = require('express').Router();
var fs = require('fs');
var app = require('../server');
var path = require('path');
var userDao = require('../dao/UserDao');
var environment = require('../service/api/v1/EnvironmentService')

router.route('/')
    .get(function (req, res) {
    res.send("return from /api/ [get]");
});

router.use('/v1', require('./api/v1/V1Controller'));

router.route('/videos')
    .get(function(req, res) {
        const videoPath = path.join(__dirname, "../../resource/public/video");

        fs.readdir(videoPath, function (err, files) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }

            // for (var i = 0; i < files.length, i++) {
            //     var filename = files[i];
            //
            // }

            res.status(200).send(files);
        });
    });


var user = {
    user_name : null,
    authority : null
};
//todo : change login logic
router.route('/login')
    .post(function (req, res) {
        console.log(req.body);
        userDao.selectUserByUserId(req.body, (err, result) => {
        if (err) {
            res.status(401).send(err);
        }
        else {
            if (result.length == 0) {
                console.log('id not found');
                res.status(404).send('Id nor found');
            }
            else if (req.body.password === result[0].password) {
                user.user_name = result[0].user_name;
                user.authority = result[0].authority;
                req.session.userName = result[0].user_name;
                req.session.authority = result[0].authority;
                res.redirect('/dashboard');
            }else if (req.body.password !== result[0].password){
                console.log('password error');
                res.status(400).send('password error');
            }else {
                console.log("what error?");
            }
        }})
    });

router.route('/regist')
    .post(function (req, res) {
        userDao.insert(req.body, (err, result) => {
            if (err) {
                res.status(401).send(err);
            }
            else {
                // res.status(201).send(result);
                // res.render('/')
                res.redirect('/');
            }
        })
    });

router.route('/logout')
    .post(function (req, res) {
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        });
    });

router.route('/hourtemp')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getHourTemperature(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                // console.log(result);
                res.status(200).send(result);
            }
        });
    });

router.route('/hourhumi')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getHourHumidity(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        });
    });

router.route('/hourillumi')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getHourIllumination(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        });
    });

router.route('/daytemp')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getDayTemperature(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        });
    });

router.route('/dayhumi')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getDayHumidity(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        });
    });

router.route('/dayillumi')
    .post(function (req, res) {
        console.log(req.body);
        var value = req.body;
        environment.getDayIllumination(value, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(result);
            }
        });
    });

module.exports = router;



