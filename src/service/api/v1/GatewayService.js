var gatewayDao = require('../../../dao/GatewayDao');

function findAllGateway(callback) {
    gatewayDao.findAll(callback);
}

function findGatewayById(id, callback) {
    gatewayDao.findById(id, callback)
}

function insertGateway(gateway, callback) {
    gatewayDao.insert(gateway, callback);
}

function updateGateway(id, gateway, callback) {
    gatewayDao.update(id, gateway, callback);
}

function deleteById(id, callback) {
    gatewayDao.deleteById(id, callback);
}

function searchName(name, callback){
    gatewayDao.searchName(name, callback);
}

module.exports = {
    findAllGateway : findAllGateway,
    findGatewayById : findGatewayById,
    insertGateway : insertGateway,
    updateGateway : updateGateway,
    deleteById: deleteById,
    searchName: searchName
};
