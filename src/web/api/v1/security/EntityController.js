var router = require('express').Router();
var entityService = require('../../../../service/api/v1/SecurityService').entityService;
let logger = require('log4js').getLogger('EntityController.js');

router.route('/')
    .get(function (req, res) {
        entityService.selectAll(function(err, result) {
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
            entityService.insertBulk(function(err, result) {
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(result)
                }
            })
        }
        else if (req.body) {
            entityService.insert(req.body, function(err, result){
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
            entityService.selectById(req.params.id, function(err, result) {
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
        res.status(200).send('entity');
    })
    .delete(function (req, res)  {
        res.status(200).send('entity');
    });

module.exports = router;