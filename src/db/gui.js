var mysql = require('mysql');

// var connection = mysql.createPool({
//
//     host: '10.0.0.24',
//     user: 'rtst',
//     password: 'rtst0653',
//     database: 'test',
//     timezone: 'UTC'
// });

var connection = mysql.createPool({

    host: '192.168.0.3',
    user: 'rtst',
    password: 'etri1234',
    database: 'iot-prototype_production'
});

module.exports = connection;
