var router = require('express').Router();
let logger = require('log4js').getLogger('ResourceController.js');
var tokenService = require('../../../../service/api/v1/SecurityService').tokenService;

router.route('/')
    .get(function (req, res) {
        tokenService.selectAll(function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send(result);
            }
        });
    })
    .post(function (req, res) {
        if(req.body.bulk) {
            tokenService.insertBulk(function(err, result) {
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(result)
                }
            })
        }
        else if (req.body) {
            tokenService.insert(req.body, function(err, result){
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(result)
                }
            })
        }
        else {
            res.status(400).send('Bad Request!');
        }
    });

router.route('/:id')
    .get(function (req, res) {
        if (req.params.id) {
            tokenService.selectById(req.params.id, function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            });
        }
    })
    .put(function (req, res) {
        res.status(200).send('resource');
    })
    .delete(function (req, res) {
        res.status(200).send('resource');
    });

module.exports = router;