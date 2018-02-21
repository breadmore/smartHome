var router = require('express').Router();

var time = require('./time');

router.route('/')
    .get(function (req, res) {
    res.send("return from /api/ [get]");
});

router.use('/time', time);

module.exports = router;



