// var logger = require('log4js').getLogger('UserDao.js');
// var db = require('../../components/DataBaseComponent');
//
//
// module.exports = {
//     searchAllUsers: searchAllUsers,
//     searchOneUserByUserId: searchOneUserByUserId,
//     insertUser: insertUser,
//     deleteOneUserByUserId: deleteOneUserByUserId,
//     updateOneUserByUserId: updateOneUserByUserId
// }
//
//
// // search all users records.
// function searchAllUsers() {
//     let sql = 'SELECT * FROM user';
//
//     return db.searchAll(sql);
// }
//
//
// // search one user record by user_id.
// function searchOneUserByUserId(user_id) {
//     let sql = 'SELECT * FROM user WHERE user_id = "' + user_id + '"';
//
//     return db.searchOne(sql);
// }
//
//
// // update one user record by user_id.
// function updateOneUserByUserId(user_id, userJsonObj) {
//     let str = "";
//
//     for (let key in userJsonObj) {
//         // string or number distinction
//         if (typeof (userJsonObj[key]) === 'string') {
//             str += key + ' = "' + userJsonObj[key] + '", ';
//         }
//         else {
//             str += key + ' = ' + userJsonObj[key] + ', ';
//         }
//     }
//
//     str = str.substr(0, str.length - 2);
//     let sql = 'UPDATE user SET ' + str + ' WHERE user_id = "' + user_id + '"';
//
//     db.updateOne(sql);
// }
//
//
// // delete one user record by user_id.
// function deleteOneUserByUserId(user_id) {
//     let sql = 'DELETE FROM user WHERE user_id = "' + user_id + '"';
//
//     db.deleteOne(sql);
// }
//
//
// // insert one user record.
// function insertUser(userJsonObj) {
//     let columns = ""; // 컬럼
//     let datas = ''; // 데이터
//
//     for (let key in userJsonObj) {
//         columns += key + ',';
//
//         // string or number distinction
//         if (typeof (userJsonObj[key]) === 'string') {
//             datas += '"' + userJsonObj[key] + '",';
//         }
//         else {
//             datas += userJsonObj[key] + ',';
//         }
//     }
//
//     // 마지막 ',' 빼기
//     columns = columns.substr(0, columns.length - 1);
//     datas = datas.substr(0, datas.length - 1);
//
//     let sql = 'INSERT INTO user (' + columns + ') VALUES (' + datas + ')';
//
//     db.insertOne(sql);
// }
//
