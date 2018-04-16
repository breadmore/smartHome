var router = require('express').Router();
let logger = require('log4js').getLogger('PolicyController.js');
var policyService = require('../../../../service/api/v1/SecurityService').policyService;

router.route('/')
    .get(function (req, res) {
        policyService.selectAll(function(err, result) {
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
            policyService.insertBulk(function(err, result) {
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(result)
                }
            })
        }
        else if (req.body) {
            policyService.insert(req.body, function(err, result){
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
    .get(function(req, res){
        if (req.params.id) {
            policyService.selectById(req.params.id, function(err, result) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.status(200).send(result);
                }
            });
        }
    })
    .put(function(req, res){
        res.status(200).send('policy');
    })
    .delete(function (req, res)  {
        res.status(200).send('policy');
    });

module.exports = router;