var router = require('express').Router();
let logger = require('log4js').getLogger('DeviceController.js');

var authService = require('../../../service/api/v1/AuthsService');

router.route('/')
/**
 * get all devices information.
 */
    .get(function (req, res) {
        authService.getAllAuths(function(err, result){
             if (err) {
                 res.status(500).send(err);
             }
             else {
                 // console.log(result);
                 res.status(200).send(result);
             }
        });
    })
    /**
     * add device.
     */
    .post(function (req, res) {
        if (req.body.bulk) {
            authService.insertDummyData(function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).send();
                }
            })
        }
        else if (req.body.auth) {
            authService.insertAuth(req.body.auth, function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(201).send(result);
                }
            });

        }
        else {
            res.status(400).send()
        }
    });


router.route('/:deviceId')
/**
 * get device information.
 */
    .get(function (req, res) {
        if (req.params.deviceId) {
            authService.getAuthByDid(req.params.deviceId, function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            });
        }
    })
/**
 *
 */
    .delete(function (req, res) {
        console.log("ID: "+req.params.deviceId);
        authService.deleteDeviceById(req.params.deviceId,function (err, result){
            if(err){
                res.status(401).send(err);
            }
            else{
                res.status(200).send(result);
            }
        })
    })

    .put(function (req,res) {
        req.body.id = req.params.deviceId;
        authService.updateDeviceById(req.body, function (err,result) {
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{
                res.status(200).send(result);

            }
        })
    })

/**
 * gatewaydelete
 */
router.route('/did/:deviceId')
    .delete(function (req, res) {
        authService.deleteGatewayByDId(req.params.deviceId,function (err, result){
            if(err){
                res.status(401).send(err);
            }
            else{
                res.status(200).send(result);
            }
        })
        // res.status(200).send(userService.deleteUserByUserId(req.params.id));
    })
module.exports = router;