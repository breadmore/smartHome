var router = require('express').Router();

var time = require('./api/time');

router.route('/')
    .get(function (req, res) {
    res.send("return from /api/ [get]");
});

//todo : change login logic
router.route('/login')
    .post(function (req, res) {
        res.redirect('/dashboard');
    });



// todo : remove me! test controller
router.use('/time', require('./api/time'));


module.exports = router;



