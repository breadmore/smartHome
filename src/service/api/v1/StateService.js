var stateDao = require('../../../dao/StatesDao');


function getLastState(callback) {
    return stateDao.getLastState(callback);
}

function insertState(state, callback) {
    return stateDao.insertState(state, callback);
}
function updateState(state, callback) {
    return stateDao.updateState(state, callback);
}

module.exports = {
    getLastState: getLastState,
    insertState: insertState,
    updateState: updateState
};