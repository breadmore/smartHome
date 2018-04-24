var router = require('express').Router();
var userService = require('../../../service/api/v1/UserService');

router.route('/')
    .get(function (req, res) {
        userService.selectAllUsers(function(err, result){
            if (err) {
                res.status(401).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    })
    .post(function(req, res){
       userService.addUser(req.body, function(err, result){
           if (err) {

           }
           else {

           }
       })
    });

module.exports = router;