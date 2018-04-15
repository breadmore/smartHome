/* eslint-env node */
/* eslint indent:0,semi:0, no-console: 0 */
/* jshint devel: true, node: true*/
/* global: */

/***
 * Start an instance of Node-Red under Express.JS
 *
 * Allows multiple instances of Node-Red to be run, even different versions in parallel.
 ***/

"use strict" /* always for Node.JS, never global in the browser */;

// logging ************
// you should consider using the packages debug and console-stamp to
// incorporate standard logging with node-red logging

// The TCP port for this systems web interface - picked up from env, package.json or fixed value
const http_port =
  process.env.HTTPPORT || process.env.npm_package_config_http_port || 1880;
const use_https =
  process.env.USEHTTPS ||
  process.env.npm_package_config_use_https == "true" ||
  false;
const listening_address =
  process.env.LISTENINGADDRESS ||
  process.env.npm_package_config_listening_address ||
  "0.0.0.0";

const http = use_https ? require("https") : require("http");

const express = require("express"); // THE std library for serving HTTP
const RED = require("node-red");
var nrSettings = require("../settings.js"); // Node-Red settings file
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose(); // sqlite3 db

const bodyParser = require('body-parser');
// const httpLogger = require('morgan');

var log4js = require('log4js');
log4js.configure('./config/logger/log4js.json');

// you can set a default credential secret for storing node's credentials within node red
// normally this is secret is generated randomly and stored in the user directory (config)
// if you are sharing your flows over different systems  (e.g. windows, linux etc)
// and want to keep your used credentials used within your flow, it more convenient to setup
// a fixed secret here
if (
  !(process.env.npm_package_config_nr_credentialsecret === undefined ||
    process.env.npm_package_config_nr_credentialsecret === null)
)
  nrSettings.credentialSecret =
    process.env.npm_package_config_nr_credentialsecret;

if (process.env.npm_package_config_nr_userfolder)
  nrSettings.userDir = process.env.npm_package_config_nr_userfolder;

if (process.env.npm_package_config_nr_flowfile)
  nrSettings.flowFile = process.env.npm_package_config_nr_flowfile;

if (process.env.npm_package_config_nr_title) {
  nrSettings.editorTheme.page.title = nrSettings.editorTheme.header.title =
    process.env.npm_package_config_nr_title;
}

// Create an Express app
var app = express();
var path = require('path');
var socket = require('socket.io');

// get the db file path
const dbPath = path.join(__dirname, "db/test.db");

// validate db existence
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) { 
    console.error('could not find test database. Making it...');
    //make db
    db = new sqlite3.Database(dbPath);

    // sync process creating table.
    db.serialize(() => {
      let init_database = require('./db/old/init_database')
      db.run(init_database.initDevice());
      db.run(init_database.initGateway());
      db.run(init_database.initPolicy());
      db.run(init_database.initUser());
      db.run(init_database.initSensorLog());
  });

  } else {
    console.log('Connected to the test database.');
  }
});

///////////////////////


// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host  : '10.0.0.24',
//     user  : 'rtst',
//     password  : 'rtst0653',
//     port  : 3306,
//     database : 'test'
// });
//
// connection.connect();
//
// connection.query('SELECT * FROM actions', function(err, rows, fields) {
//     if (!err) {
//         console.log('The solution is: ', rows);
//         console.log('The solution is: ', fields);
//     }
//     else
//         console.log('Error while performing Query.', err);
// });
//
// connection.end();

// db.serialize(() => {
//   db.all('SELECT * FROM device', (err, rows) => {
//     console.log(rows);
//   });

// db.each('SELECT * FROM device', (err, row) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log(row);
// });
// });

/**
 * Database Connection using sequelize
 *
 */
//
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('mysql://classact:classact!@10.0.0.24:3306/test');
// sequelize.authenticate()
//     .then(() => {
//     console.log('Connection Successful');
//     })
//     .catch(err => {
//         console.log(err);
//     });



module.exports.db = db;

var resourcePath = path.join(__dirname, '../resource');

// app http settings.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
// app.use(httpLogger('dev'));

app.set('view engine', 'jade');
app.set('views', path.join(resourcePath + '/view'));
app.use(express.static(resourcePath + '/public'));

// Add a simple route for static content served from './public'

// app.get('/*', function(req, res, next){
//     res.setHeader('Last-Modified', (new Date()).toUTCString());
//     next();
// });
app.use("/", require('./web/ViewController'));
app.use("/api", require('./web/ApiContoller'));
app.use("/v1", require("./web/api/v1/V1Controller"));

// Add static route for bower components from './bower_components'
app.use("/bower_components", express.static("./bower_components"));

// Create the http(s) server
if (use_https) {
  var privateKey = fs.readFileSync("./server.key", "utf8");
  var certificate = fs.readFileSync("./server.crt", "utf8");
  var credentials = {
    key: privateKey,
    cert: certificate
  };
}
var httpServer = use_https
  ? http.createServer(credentials, app)
  : http.createServer(app);

var io = socket(httpServer);
exports.clientSocket = function (url, data) {
  io.sockets.emit(url, data);

};
module.exports.io = io;
io.use(function (socket, next) {
  console.info('SOCKETIO SESSION START');
  next();
});
io.on('connection', require('./web/SocketController'));

// Initialise the runtime with a server and settings
// @see http://nodered.org/docs/configuration.html
RED.init(httpServer, nrSettings);

// Serve the editor UI from /admin
app.use(nrSettings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes from /
app.use(nrSettings.httpNodeRoot, RED.httpNode);


// httpServer.listen(http_port, listening_address, function() {
httpServer.listen(http_port, function () {
  console.info(
    "Express 4 https server listening on http%s://%s:%d%s, serving node-red",
    use_https ? "s" : "",
    httpServer.address().address.replace("0.0.0.0", "localhost"),
    httpServer.address().port,
    nrSettings.httpAdminRoot
  );
});

// Start the runtime
RED.start().then(function () {
  console.info("------ Engine started! ------");
});

