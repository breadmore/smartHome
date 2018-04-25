var router = require('express').Router();
let logger = require('log4js').getLogger('XiaomiContoller.js');
var xiaomiService = require('../../../service/api/v1/XiaomiService');

/**
 *
 */
router.route('/')
    /** get All Xiaomi device status*/
    .get(function (req, res) {

    })
    .post(function (req, res) {
        switch (req.body.cmd) {
            case 'report':
                xiaomiService.reportService(req.body.model, req.body.data, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    else {
                        res.status(200).send();
                    }
                });
                break;
            case 'read_ack':
                console.log('read_ack');
                xiaomiService.readAckService(req.body.model, req.body.data, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    else {
                        res.status(200).send();
                    }
                });
                break;

            case 'heartbeat':
            case 'write_ack':
            default:
                // console.log(req.body);
                res.status(200).send();
                break;
        }
    });

module.exports = router;