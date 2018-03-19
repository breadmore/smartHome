var socketComponent = require('../../components/SocketComponent');

function testService(socket, url, data) {
    socketComponent.responseToTargetSocket(socket, url, data);
}

module.exports = {
    testService : testService
};
