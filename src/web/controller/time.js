var app = require('express');
var router = app.Router();

router.route('/')
    .get(function (req, res) {
        res.send("/api/time [get]" + Date.now());
    })
    .post(function (req, res) {
        console.info(req.body);
        res.send(req.body.name);
    });

module.exports = router;