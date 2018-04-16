var policyDao = require('../../../dao/security/PolicyDao');
var entityDao = require('../../../dao/security/EntityDao');
var resourceDao = require('../../../dao/security/ResourceDao');
let logger = require('log4js').getLogger('SecurityService.js');
var app = require('../../../server');

/** bulkdata set*/
var insertBulkData = {
    policy: function (callback) {
        policyDao.insertDummyData(callback);
    },
    entity: function(callback) {
        entityDao.insertDummyData(callback);
    },
    resource: function(callback) {
        resourceDao.insertDummyData(callback);
    }
};


var EntityService = {
    insert: function (entity, callback) {
        entityDao.insertEntity(entity, callback);
    },
    selectAll : function(callback) {
        entityDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        entityDao.selectById(id, callback);
    },
    insertBulk: function(callback) {
        entityDao.insertDummyData(callback);
    }
};


var ResourceService = {
    insert: function (entity, callback) {
        resourceDao.insertResource(entity, callback);
    },
    selectAll : function(callback) {
        resourceDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        resourceDao.selectById(id, callback);
    },
    insertBulk: function(callback) {
        resourceDao.insertDummyData(callback);
    }
};


var PolicyService = {
    insert: function (entity, callback) {
        policyDao.insertEntity(entity, callback);
    },
    selectAll : function(callback) {
        policyDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        policyDao.selectById(id, callback);
    },
    insertBulk: function (callback) {
        policyDao.insertDummyData(callback);
    }
};



module.exports = {
    insertBulkData: insertBulkData,
    entityService: EntityService,
    resourceService: ResourceService,
    policyService: PolicyService
};
