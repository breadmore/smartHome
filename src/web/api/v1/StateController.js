var router = require('express').Router();
let logger = require('log4js').getLogger('StateController.js');
var stateService = require('../../../service/api/v1/StateService');

var state = {
    mode: null,
    led: null,
    gas_blocker: null,
    gas_detector: null,
    human_detector: null,
    window_detector: null
};

/**
 * Legacy Device State.
 */
router.route('/')
    .get(function (req, res) {

    })
    .post(function (req, res) {

    });

router.route('/gas')
    .get(function(req, res){
    })
    .post(function(req, res){
        switch (req.body.status) {
            case '0':
                state.gas_blocker = 0;
                break;
            case '1':
                state.gas_blocker = 1;
                break;
            case '2':
                state.gas_detector = 0;
                break;
            case '3':
                state.gas_detector = 1;
                break;
            default:
                break;
        }
        console.log(state);
        stateService.updateState(state, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send();
            }
        })
    });
//
router.route('/detect')
    .get(function (req, res) {

    })
    .post(function (req, res){
        switch (req.body.status) {
            case '00':
                state.window_detector = 0;
                break;
            case '01':
                state.window_detector = 1;
                break;
            case '10':
                state.human_detector = 0;
                break;
            case '11':
                state.human_detector = 1;
                break;
            default:
                break;
        }
        console.log(state);
        stateService.updateState(state, function(err, result) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.status(200).send();
            }
        })
    });

router.route('/room')
    .get(function(req, res){

    })
    .post(function (req, res) {
        // stateService.updateState(state)
    });

module.exports = router;