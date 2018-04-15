var mysql = require('mysql');

var connection = mysql.createPool({

    host: '10.0.0.24',
    user: 'rtst',
    password: 'rtst0653',
    database: 'test'
});

module.exports = connection;
