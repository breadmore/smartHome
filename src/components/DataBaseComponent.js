var logger = require('log4js').getLogger('db.js');
let db = require('../server').db;


module.exports = {
    inItTable: inItTable,
    searchAll: searchAll,
    searchOne: searchOne,
    insertOne: insertOne,
    deleteOne: deleteOne,
    updateOne: updateOne
}


// create tables if don't exist.
function inItTable() {

}

// search all records in the table by sql.
function searchAll(sql) {
    return new Promise(function (resolve, reject) {
        let responseObj;
        db.all(sql, function (err, rows) {
            if (err) {
                logger.error(err);
                responseObj = {
                    'error': err
                };
                reject(responseObj);
            } else {
                logger.info(rows);
                responseObj = rows;
                resolve(responseObj);
            }
        });
    });
}


// search one record in the table by sql.
function searchOne(sql) {
    return new Promise(function (resolve, reject) {
        let responseObj;
        db.get(sql, function (err, row) {
            if (err) {
                logger.error(err);
                responseObj = {
                    'error': err
                };
                reject(responseObj);
            } else {
                logger.info(row);
                responseObj = row;
                resolve(responseObj);
            }
        });
    });
}


// update one record in the table by sql.
function updateOne(sql) {
    return db.run(sql, function (err) {
        if (err) {
            logger.error(err);
        } else {
            logger.info(`Row updated: ${this.changes}`);
        }
    });
}


// delete one record in the table by sql.
function deleteOne(sql) {
    return db.run(sql, function (err) {
        if (err) {
            logger.error(err);
        } else {
            logger.info(`Row deleted: ${this.changes}`);
        }
    });
}


// insert one record in the table by sql.
function insertOne(sql) {
    db.run(sql, function (err) {
        if (err) {
            logger.error(err.message);
        } else {
            logger.info(`Row inserted: ${this.changes}`);
        }
    });
}

