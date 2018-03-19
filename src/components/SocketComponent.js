var io = require('../server').io;

function responseToTargetSocket(socket, url, data) {
    socket.emit(url, data);
}

// function responseToAll(url, data) {
//     return  io.sockets.to()
// }

module.exports = {
    responseToTargetSocket : responseToTargetSocket
};