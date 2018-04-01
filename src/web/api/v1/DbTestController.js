var router = require('express').Router();
var dbDevice = require('../../../dao/DeviceDao');
var dbGateway = require('../../../dao/GatewayDao');
var dbPolicy = require('../../../dao/PolicyDao');
var dbUser = require('../../../dao/UserDao');
var dbWebLog = require('../../../dao/WebLogDao');



////////////////////////////////////////////////////////////////////////////////////////////
//DeviceDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////
/*
*search all devices
*/
router.route('/device').get(function (req, res) {
    dbDevice.searchAllDevices().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*search one device
*@param : sid
*/
router.route('/device/:sid').get(function (req, res) {
    dbDevice.searchOneDeviceBySid(req.params.sid).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*update one device
*@params : sid, deviceJsonObj
*/
router.route('/device/:sid').put(function (req, res) {
    res.status(200).send(dbDevice.updateOneDeviceBySid(req.params.sid, req.body));
});


/*
*delete one device
*@param : sid
*/
router.route('/device/:sid').delete(function (req, res) {
    res.status(200).send(dbDevice.deleteOneDeviceBySid(req.params.sid));
});


/*
*insert one device
*@params : deviceJsonObj
*/
router.route('/device').post(function (req, res) {
    res.status(200).send(dbDevice.insertDevice(req.body));
});










////////////////////////////////////////////////////////////////////////////////////////////
//GatewayDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////
/*
*search all gateways
*/
router.route('/gateway').get(function (req, res) {
    dbGateway.searchAllGateways().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*search one gateway
*@param : uuid
*/
router.route('/gateway/:uuid').get(function (req, res) {
    const uuid = Number(req.params.uuid);

    dbGateway.searchOneGatewayByUuid(uuid).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*update one gateway
*@params : uuid, gatewayJsonObj
*/
router.route('/gateway/:uuid').put(function (req, res) {
    const uuid = Number(req.params.uuid);

    res.status(200).send(dbGateway.updateOneGatewayByUuid(uuid, req.body));
});


/*
*delete one gateway
*@param : uuid
*/
router.route('/gateway/:uuid').delete(function (req, res) {
    const uuid = Number(req.params.uuid);

    res.status(200).send(dbGateway.deleteOneGatewayByUuid(uuid));
});


/*
*insert one gateway
*@params : gatewayJsonObj
*/
router.route('/gateway').post(function (req, res) {
    res.status(200).send(dbGateway.insertGateway(req.body));
});









////////////////////////////////////////////////////////////////////////////////////////////
//PolicyDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////
/*
*search all policys
*/
router.route('/policy').get(function (req, res) {
    dbPolicy.searchAllPolicys().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*search one policy
*@param : id
*/
router.route('/policy/:id').get(function (req, res) {
    const id = Number(req.params.id);

    dbPolicy.searchOnePolicyById(id).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*update one policy
*@params : id, policyJsonObj
*/
router.route('/policy/:id').put(function (req, res) {
    const id = Number(req.params.id);

    res.status(200).send(dbPolicy.updateOnePolicyById(id, req.body));
});








////////////////////////////////////////////////////////////////////////////////////////////
//UserDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////
/*
*search all users
*/
router.route('/user').get(function (req, res) {
    dbUser.searchAllUsers().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*search one user
*@param : user_id
*/
router.route('/user/:user_id').get(function (req, res) {
    dbUser.searchOneUserByUserId(req.params.user_id).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*update one user
*@params : user_id, userJsonObj
*/
router.route('/user/:user_id').put(function (req, res) {
    res.status(200).send(dbUser.updateOneUserByUserId(req.params.user_id, req.body));
});


/*
*delete one user
*@param : user_id
*/
router.route('/user/:user_id').delete(function (req, res) {
    res.status(200).send(dbUser.deleteOneUserByUserId(req.params.user_id));
});


/*
*insert one user
*@params : userJsonObj
*/
router.route('/user').post(function (req, res) {
    res.status(200).send(dbUser.insertUser(req.body));
});








////////////////////////////////////////////////////////////////////////////////////////////
//WebLogDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////
/*
*search all web_logs
*/
router.route('/webLog').get(function (req, res) {
    dbWebLog.searchAllWebLogs().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});



module.exports = router;