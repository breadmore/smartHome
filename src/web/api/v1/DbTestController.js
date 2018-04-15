var router = require('express').Router();
var dbDevice = require('../../../dao/old/DeviceDao');
var dbGateway = require('../../../dao/old/GatewayDao');
var dbPolicy = require('../../../dao/old/PolicyDao');
var dbUser = require('../../../dao/old/UserDao');
var dbSensorLog = require('../../../dao/old/SensorLogDao');



////////////////////////////////////////////////////////////////////////////////////////////
//DeviceDao Test Controller
////////////////////////////////////////////////////////////////////////////////////////////


/*
*list devices.
*/
router.route('/device').get(function (req, res) {
    dbDevice.listDevices().then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*list devices in page.
*@param = (integer)offset, (integer)page
*/
router.route('/device/:offset/:page').get(function (req, res) {
    const offset = Number(req.params.offset);
    const page = Number(req.params.page);

    dbDevice.listDevicesInPage(offset,page).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*list devices by type.
*@param = (integer)type
*/
router.route('/deviceType/:type').get(function (req, res) {
    const type = Number(req.params.type);

    dbDevice.listDevicesByType(type).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err + 'hahahahahahahahhaah');
    })
});


/*
*search one device
*@param : (integer)id
*/
router.route('/device/:id').get(function (req, res) {
    const id = Number(req.params.id);
    console.log(req.params);

    dbDevice.searchOneDeviceById(id).then((value) => {
        res.status(200).send(value);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


/*
*update one device
*@params : (integer)id, (JSON object)deviceJsonObj
*/
router.route('/device/:id').put(function (req, res) {
    const id = Number(req.params.id);

    res.status(200).send(dbDevice.updateOneDeviceById(id, req.body));
});


/*
*delete one device
*@param : (integer)id
*/
router.route('/device/:id').delete(function (req, res) {
    const id = Number(req.params.id);

    res.status(200).send(dbDevice.deleteOneDeviceById(id));
});


/*
*insert one device
*@params : (JSON object)deviceJsonObj
*/
router.route('/device').post(function (req, res) {
    console.log(req.body);
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
// router.route('/policy').get(function (req, res) {
//     dbPolicy.searchAllPolicys().then((value) => {
//         res.status(200).send(value);
//     }).catch((err) => {
//         res.status(500).send(err);
//     })
// });


// /*
// *search one policy
// *@param : id
// */
// router.route('/policy/:id').get(function (req, res) {
//     const id = Number(req.params.id);

//     dbPolicy.searchOnePolicyById(id).then((value) => {
//         res.status(200).send(value);
//     }).catch((err) => {
//         res.status(500).send(err);
//     })
// });


// /*
// *update one policy
// *@params : id, policyJsonObj
// */
// router.route('/policy/:id').put(function (req, res) {
//     const id = Number(req.params.id);

//     res.status(200).send(dbPolicy.updateOnePolicyById(id, req.body));
// });








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
// router.route('/webLog').get(function (req, res) {
//     dbWebLog.searchAllWebLogs().then((value) => {
//         res.status(200).send(value);
//     }).catch((err) => {
//         res.status(500).send(err);
//     })
// });



module.exports = router;