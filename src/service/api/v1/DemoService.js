var logger = require('log4js').getLogger('DemoService');
var socketComponents = require('../../../components/SocketComponent');


function reportService(model, data, cb) {
    switch (model) {
        case "gateway":
            logger.info(model, "in reportService");
            break;
        case "switch":
            logger.info(model, "in reportService");
            break;
        case "plug":
            logger.info(model, "in reportService");
            break;
        case "motion":
            logger.info(model, "in reportService");
            break;
        case "magnet":
            logger.info(model, "in reportService");
            break;
        default:
            logger.error("error : model not matched in reportService", model);
            break;
    }

}

function wirteackService(model, data, cb) {
    switch (model) {
        case "gateway":
            logger.info(model, "in wirteackService");
            break;
        case "switch":
            logger.info(model, "in wirteackService");
            break;
        case "plug":
            logger.info(model, "in wirteackService");
            break;
        case "motion":
            logger.info(model, "in wirteackService");
            break;
        case "magnet":
            logger.info(model, "in wirteackService");
            break;
        default:
            logger.error("error : model not matched in wirteackService", model);
            break;
    }

}

function readackService(model, data, cb) {
    switch (model) {
        case "gateway":
            logger.info(model, "in readackService");
            break;
        case "switch":
            logger.info(model, "in readackService");
            break;
        case "plug":
            logger.info(model, "in readackService");
            break;
        case "motion":
            logger.info(model, "in readackService");
            break;
        case "magnet":
            logger.info(model, "in readackService");
            break;
        default:
            logger.error("error : model not matched in readackService", model);
            break;
    }

}

function heartbeatService(model, data, cb) {
    switch (model) {
        case "gateway":
            logger.info(model, "in heartbeatService");
            break;
        case "switch":
            logger.info(model, "in heartbeatService");
            break;
        case "plug":
            logger.info(model, "in heartbeatService");
            break;
        case "motion":
            logger.info(model, "in heartbeatService");
            break;
        case "magnet":
            logger.info(model, "in heartbeatService");
            break;
        default:
            logger.error("error : model not matched in heartbeatService", model);
            break;
    }
}


function detectService(socket, url, data) {

    // return socketComponents.responseToTargetSocket(socket, url, data);
}

function temhumServcie(socket, url, data) {
    return socketComponents.responseToTargetSocket(socket, url, data);
}

function gasService(socket, url, data) {
    return socketComponents.responseToTargetSocket(socket, url, data);
}

module.exports = {
    reportService: reportService,
    writeackService: wirteackService,
    readackService: readackService,
    heartbeatService: heartbeatService,
    jaesilService : detectService,
    temhumServcie: temhumServcie,
    gasService: gasService

};