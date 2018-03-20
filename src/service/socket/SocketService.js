var socketComponent = require('../../components/SocketComponent');

//todo : remove test code.
function testService(socket, url, data) {
    socketComponent.responseToTargetSocket(socket, url, data);
}







module.exports = {
    testService : testService
};
