var logger = require('log4js').getLogger('PolicyDao.js');
var db = require('../components/DataBaseComponent');


module.exports = {
    searchAllPolicys: searchAllPolicys,
    searchOnePolicyById: searchOnePolicyById,
    updateOnePolicyById: updateOnePolicyById
}


// search all policys records.
function searchAllPolicys() {
    let sql = 'SELECT * FROM policy';

    return db.searchAll(sql);
}


// serach one policy record by id.
function searchOnePolicyById(id) {
    let sql = 'SELECT * FROM policy WHERE id = ' + id;

    return db.searchOne(sql);
}


// update one policy record by id.
function updateOnePolicyById(id, policyJsonObj) {
    let str = "";

    for (let key in policyJsonObj) {
        // string or number distinction
        if (typeof (policyJsonObj[key]) === 'string') {
            str += key + ' = "' + policyJsonObj[key] + '", ';
        }
        else {
            str += key + ' = ' + policyJsonObj[key] + ', ';
        }
    }

    str = str.substr(0, str.length - 2);
    let sql = 'UPDATE policy SET ' + str + ' WHERE id = ' + id;

    db.updateOne(sql);
}

