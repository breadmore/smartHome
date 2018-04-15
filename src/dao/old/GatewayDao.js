// var logger = require('log4js').getLogger('GatewayDao.js');
// var db = require('../components/DataBaseComponent');
//
//
// module.exports = {
//     searchAllGateways: searchAllGateways,
//     searchOneGatewayByUuid: searchOneGatewayByUuid,
//     insertGateway: insertGateway,
//     deleteOneGatewayByUuid: deleteOneGatewayByUuid,
//     updateOneGatewayByUuid: updateOneGatewayByUuid
// }
//
//
// // search all gateways records.
// function searchAllGateways() {
//     let sql = 'SELECT * FROM gateway';
//
//     return db.searchAll(sql);
// }
//
//
// // search one gateway record by uuid.
// function searchOneGatewayByUuid(uuid) {
//     let sql = 'SELECT * FROM gateway WHERE uuid = ' + uuid;
//
//     return db.searchOne(sql);
// }
//
//
// // update one gateway record by uuid
// function updateOneGatewayByUuid(uuid, gatewayJsonObj) {
//     let str = "";
//
//     for (let key in gatewayJsonObj) {
//         // string or number distinction
//         if (typeof (gatewayJsonObj[key]) === 'string') {
//             str += key + ' = "' + gatewayJsonObj[key] + '", ';
//         }
//         else {
//             str += key + ' = ' + gatewayJsonObj[key] + ', ';
//         }
//     }
//
//     str = str.substr(0, str.length - 2);
//     let sql = 'UPDATE gateway SET ' + str + ' WHERE uuid = ' + uuid;
//
//     db.updateOne(sql);
// }
//
//
// // delete one gateway record by uuid.
// function deleteOneGatewayByUuid(uuid) {
//     let sql = 'DELETE FROM gateway WHERE uuid = ' + uuid;
//
//     db.deleteOne(sql);
// }
//
//
// // insert one gateway record.
// function insertGateway(gatewayJsonObj) {
//     let columns = ""; // 컬럼
//     let datas = ''; // 데이터
//
//     for (let key in gatewayJsonObj) {
//         columns += key + ',';
//
//         // string or number distinction
//         if (typeof (gatewayJsonObj[key]) === 'string') {
//             datas += '"' + gatewayJsonObj[key] + '",';
//         }
//         else {
//             datas += gatewayJsonObj[key] + ',';
//         }
//     }
//
//     // 마지막 ',' 빼기
//     columns = columns.substr(0, columns.length - 1);
//     datas = datas.substr(0, datas.length - 1);
//
//     let sql = 'INSERT INTO gateway (' + columns + ') VALUES (' + datas + ')';
//
//     db.insertOne(sql);
// }
//
