var router = require('express').Router();
let logger = require('log4js').getLogger('EnvironmentContoller.js');
var environmentService = require('../../../service/api/v1/EnvironmentService');
var app = require('../../../server');


/**
 * get all gateway information.
 */
router.route('/')
    .get(function (req, res) {
        logger.info(req.body);
    })
    .post(function (req, res) {
        logger.info(req.body);

    });


/**
 * Temperature Controller
 */
router.route('/temperature')
    /**
     * Return recent values
     */
    .get(function (req, res) {
        if (req.query.number === undefined) {
            environmentService.getLastTemperature(1, function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result[0]);
                }
            })
        }
        else {
            environmentService.getLastTemperature(parseInt(req.query.number), function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            })
        }

    })
    /**
     * insert value & dashboard notification.
     */
    .post(function (req, res) {
        if (req.body === undefined || req.body === null) {
            logger.error("req.body is undefined or null");
            req.status(400).send();
        }
        else {
            environmentService.insertEnvironments(req.body.type, req.body.value, function(err, result) {
                if(err) {
                    logger.error(err);
                }
                else {
                    res.status(200).send();
                    // notify to dashboard throw websocket.
                    app.clientSocket('/environments/', {type : req.body.type, value : req.body.value});
                }
            });
        }
    });

router.route('/humidity')
    .get(function (req, res) {
        if (req.query.number === undefined) {
            environmentService.getLastHumidity(1, function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result[0]);
                }
            })
        }
        else {
            environmentService.getLastHumidity(parseInt(req.query.number), function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            })
        }
    })
    .post(function (req, res) {
        if (req.body === undefined || req.body === null) {
            logger.error("req.body is undefined or null");
            req.status(400).send();
        }
        else {
            environmentService.insertEnvironments(req.body.type, req.body.value, function(err, result) {
                if(err) {
                    logger.error(err);
                }
                else {
                    res.status(200).send();
                    app.clientSocket('/environments/', {type : req.body.type, value : req.body.value});
                }
            });
        }
    });

router.route('/illuminati')
    .get(function (req, res) {
        if (req.query.number === undefined) {
            environmentService.getLastIlluminaty(1, function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result[0]);
                }
            })
        }
        else {
            environmentService.getLastIlluminaty(parseInt(req.query.number), function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            })
        }
    })
    .post(function (req, res) {
        if (req.body === undefined || req.body === null) {
            logger.error("req.body is undefined or null");
            req.status(400).send();
        }
        else {
            environmentService.insertEnvironments(req.body.type, req.body.value, function(err, result) {
                if(err) {
                    logger.error(err);
                }
                else {
                    res.status(200).send();
                }
            });
        }
    });

router.route('/envirnomentsall')
    .get(function (req, res) {
        var responseData = {
            temperature : null,
            humidity: null,
            illuminaty: null
        };
        if (req.query.number === undefined) {
            res.status(400).send();
        }
        else {
            environmentService.getLastTemperature(parseInt(req.query.number), function(err, result) {
                if (err) {
                    logger.error(err);
                    res.status(400).send(err);
                }
                else {
                    responseData.temperature = result;
                    environmentService.getLastHumidity(parseInt(req.query.number), function(err, result) {
                        if (err) {
                            logger.error(err);
                            res.status(400).send(err);
                        }
                        else {
                            responseData.humidity = result;
                            environmentService.getLastIlluminaty(parseInt(req.query.number), function(err, result) {
                                if (err) {
                                    res.status(400).send(err);
                                }
                                else {
                                    responseData.illuminaty = result;
                                    res.status(200).send(responseData);
                                }
                            })
                        }
                    })
                }
            })
        }
    });

module.exports = router;