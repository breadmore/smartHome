var router = require('express').Router();
var app = require('../server');
var fs = require('fs');
var path = require('path');

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



//todo : change login logic
router.route('/login')
    .post(function (req, res) {
        res.redirect('/dashboard');
    });

module.exports = router;



