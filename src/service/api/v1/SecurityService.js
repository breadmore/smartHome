var policyDao = require('../../../dao/security/PolicyDao');
var entityDao = require('../../../dao/security/EntityDao');
var resourceDao = require('../../../dao/security/ResourceDao');
var tokenDao = require('../../../dao/security/TokenDao');
var roleDao = require('../../../dao/security/RoleDao');
var securityDao = require('../../../dao/security/SecurityLogDao');
var authDao = require('../../../dao/AuthsDao');

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
        policyDao.insert(entity, callback);
    },
    selectAll : function(callback) {
        policyDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        policyDao.selectById(id, callback);
    },
    insertBulk: function (callback) {
        policyDao.insertDummyData(callback);
    },
    update: function (now, policy, callback) {
        policyDao.update(now, policy, callback);
    }
};

var TokenService = {
    insert: function (entity, callback) {
        tokenDao.insert(entity, callback);
    },
    selectAll : function(callback) {
        tokenDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        tokenDao.selectById(id, callback);
    },
    insertBulk: function (callback) {
        tokenDao.insertDummyData(callback);
    },
    selectByTokenId: function (body, callback) {
        tokenDao.selectByTokenId(body, callback);
    }
};

var RoleService = {
    insert: function (entity, callback) {
        roleDao.insert(entity, callback);
    },
    selectAll : function(callback) {
        roleDao.selectAll(callback);
    },
    selectById: function(id, callback) {
        roleDao.selectByResourceId(id, callback);
    },
    insertBulk: function (callback) {
        roleDao.insertDummyData(callback);
    },
    updateOperation: function (data, callback) {
        roleDao.updateOperation(data, callback);
    },
    selectById: function (id, callback) {
        roleDao.selectById(id, callback);
    }
};

function selectAllSecurityPolicy(callback) {
    securityDao.selectAllSecurityPolicy(callback);
}

function selectAllDidByEid(data, callback) {
    authDao.selectAllDidByEid(data, callback);
}


module.exports = {
    insertBulkData: insertBulkData,
    entityService: EntityService,
    resourceService: ResourceService,
    policyService: PolicyService,
    tokenService: TokenService,
    roleService: RoleService,
    selectAllPolicy: selectAllSecurityPolicy,
    selectAllDidByEid: selectAllDidByEid
};
