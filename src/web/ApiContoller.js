var router = require('express').Router();

router.route('/')
    .get(function (req, res) {
    res.send("return from /api/ [get]");
});

router.use('/v1', require('./api/v1/V1Controller'));





//todo : change login logic
router.route('/login')
    .post(function (req, res) {
        res.redirect('/dashboard');
    });
router.post('/login/demo', function (req, res)  {
   res.redirect('/new/dashboard');
});

module.exports = router;



