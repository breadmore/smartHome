var router = require('express').Router();
var fs = require('fs');
var app = require('../server');
var path = require('path');
var userDao = require('../dao/UserDao');

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
            }else {
                res.send("비밀번호 오류");
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

module.exports = router;



