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
        console.log(req.body);
       userService.addUser(req.body, function(err, result){
           if (err) {
               res.status(401).send(err);
           }
           else {
               res.status(200).send(result);
           }
       })
    });
router.route('/:id')
    .delete(function (req, res) {
        userService.deleteUserByUserId(req.params,function (err, result){
            if(err){
                res.status(401).send(err);


            }
            else{
                res.status(200).send(result);

            }
        })
        // res.status(200).send(userService.deleteUserByUserId(req.params.id));
    })
    .put(function (req,res) {
        console.log(req.body);
        userService.updateUserByUserId(req.body, function (err,result) {
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{
                res.status(200).send(result);

            }
        })
    })


module.exports = router;