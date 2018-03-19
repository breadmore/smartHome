var socketService = require('../service/socket/SocketService');
var logger = require('log4js').getLogger('SocketController');

var RED = require('node-red');

module.exports = function (socket) {
    socket.on('/topic/test', function (data) {
        // logger.info(RED.nodes.getNodeList());
        // var node = RED.nodes;

        // logger.info(node.getFlows());
        // console.log('\n\n\n');
        // logger.info(node.getNode('1eaae40c.a7618c').wires);

        socketService.testService(socket, '/topic/test', data);
    });

    // socket.on('/topic/',function() {
    //
    // })
};