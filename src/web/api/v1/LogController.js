var router = require('express').Router();
let logger = require('log4js').getLogger('SecurityController.js');
var logService = require('../../../service/api/v1/LogService');

/**
 */
router.route('/')
    .get(function (req, res) {
        logService.selectRecentSecurityLog(function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    })
    .post(function (req, res) {
        logService.insertLog(req.body, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(201).send(result);
            }
        })
    });

router.route('/policy')
    .get(function (req, res) {
        logService.selectRecentDeployLog(function (err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(201).send(result);
            }
        })
    });

// router.route('/deviceall')
//     .get(function (req, res) {
//         logService.selectAllSecurityEvent(function(err, result) {
//             if (err) {
//                 res.status(400).send(err);
//             }
//             else {
//                 res.status(200).send(result);
//             }
//         })
//     });

router.route('/recentservice')
    .get(function (req, res) {
        logService.selectRecentServiceLog(function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    });

router.route('/deployall')
    .get(function (req, res) {
        logService.selectAllDeployLog(function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        })
    })

module.exports = router;