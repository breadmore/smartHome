var router = require('express').Router();
let logger = require('log4js').getLogger('DemoController.js');

// var socket = require('../../SocketController');
var server = require('../../../server');

var demoService = require('../../../service/api/v1/DemoService');

router.route('/xiaomi')
/**
 *
 */
    .get(function (req, res) {

    })
    .post(function (req, res) {
        switch (req.body.cmd) {
            case "report":
                logger.info("report command by", req.body.model);
                break;
            case "read_ack":
                logger.info("read_ack command by", req.body.model);
                break;
            case "write_ack":
                logger.info("write_ack command by", req.body.model);
                break;
            case "heartbeat":
                logger.info("heartbeat command by", req.body.model);
                break;
            default:
                logger.error("Error: not matched case", req.body);
                break;
        }
        res.sendStatus(202);
    });


router.route('/legacy/detect')
    .post(function (req, res) {
        server.clientSocket('/legacy', req.body);
        // socket.emit("/socket/devices", req.body);
        // demoService.jaesilService(socket, "/socket/devices", req.body.status);
        // switch (req.body.status) {
        //     case "00":
        //         break;
        //     case "01":
        //         break;
        //     case "10":
        //         break;
        //     case "11":
        //         break;
        //     case "20":
        //         break;
        //     case "21":
        //         break;
        //     case "22":
        //         break;
        //     default:
        //         break;
        // }
        res.sendStatus(202);
    });

router.route('/legacy/temhum')
    .post(function (req, res) {
        server.clientSocket('/legacy', req.body);
        // switch (req.body.type) {
        //     case "temperature":
        //         break;
        //     case "humidity":
        //         break;
        //     default:
        //         break;
        // }
        res.sendStatus(202);
    });

router.route('/legacy/gas')
    .post(function (req, res) {
        server.clientSocket('/legacy', req.body);
        // switch (req.body.status) {
        //     case "0":
        //         break;
        //     case "1":
        //         break;
        //     case "2":
        //         break;
        //     case "3":
        //         break;
        //     default:
        //         break;
        // }
        res.sendStatus(202);
    });

module.exports = router;
