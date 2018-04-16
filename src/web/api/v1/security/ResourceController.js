var router = require('express').Router();
let logger = require('log4js').getLogger('ResourceController.js');
var resourceService = require('../../../../service/api/v1/SecurityService').resourceService;

router.route('/')
    .get(function (req, res) {
        resourceService.selectAll(function(err, result) {
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
            resourceService.insertBulk(function(err, result) {
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(result)
                }
            })
        }
        else if (req.body) {
            resourceService.insert(req.body, function(err, result){
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
            resourceService.selectById(req.params.id, function(err, result) {
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