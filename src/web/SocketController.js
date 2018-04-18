var socketService = require('../service/socket/SocketService');
var logger = require('log4js').getLogger('SocketController');

var RED = require('node-red');

module.exports = function (socket) {
    socket.on('/legacy/states', function(data){
        console.log('/legacy/states');
        socketService.legacyStatesService(socket, '/legacy/states');
    });

    socket.on('/startcam', function(){
        console.log('/startcam!!');
        socketService.camService(socket, 'start');
    });

};
