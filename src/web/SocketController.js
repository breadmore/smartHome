var socketService = require('../service/socket/SocketService');
var logger = require('log4js').getLogger('SocketController');

module.exports = function (socket) {
    socket.on('/topic/test', function (data) {
        logger.info('on topic/test', data);
        socketService.testService(socket, '/topic/test', data);
    });

    // socket.on('/topic/',function() {
    //
    // })
};