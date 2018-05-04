var router = require('express').Router();
let logger = require('log4js').getLogger('GatewayController.js');

var gatewayService = require('../../../service/api/v1/GatewayService');


/**
 * get all gateway information.
 */
router.route('/')
    .get(function (req, res) {
        gatewayService.findAllGateway(function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    })
    .post(function (req, res) {
        gatewayService.insertGateway(req.body.gateway, function(err, result){
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(201).send(result);
            }
        })
    });


/**
 * get router information.
 */
router.route('/:id')
    .get(function (req, res) {
        gatewayService.findGatewayById(req.params.id, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    })
    .put(function (req, res) {
       console.log(req.body);
        gatewayService.updateGateway(req.params.id ,req.body, function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            else {
                res.status(202).send(result);
            }
        })
    })
    .delete(function (req, res) {
        gatewayService.deleteById(req.params.id,function (err, result){
            if(err){
                res.status(401).send(err);
            }
            else{
                res.status(200).send(result);
            }
        })
        // res.status(200).send(userService.deleteUserByUserId(req.params.id));
    })

router.route('/gateway')
    .post(function (req, res) {
        gatewayService.searchName(req.body.name, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    });

router.route('/device')
    .post(function (req, res) {
        gatewayService.searchDeviceId(req.body.id, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    });

router.route('/policy')
    .post(function (req, res) {
        gatewayService.getPolicy(req.body.id, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    });
module.exports = router;