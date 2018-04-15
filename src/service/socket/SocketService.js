var socketComponent = require('../../components/SocketComponent');
var stateService = require('../api/v1/StateService');
//todo : remove test code.
// function testService(socket, url, data) {
//     socketComponent.responseToTargetSocket(socket, url, data);
// }

function legacyStatesService(socket, url) {
    stateService.getLastState(function(err, result){
        socketComponent.responseToTargetSocket(socket, url, result[0]);
    });
}


module.exports = {
    // testService : testService,
    legacyStatesService: legacyStatesService
};
