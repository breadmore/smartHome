const crypto = require("crypto");
const miDevicesUtils = require('../src/utils');

module.exports = (RED) => {
    function XiaomiPlugNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);
        this.sid = config.sid;
        this.status({fill:"grey", shape:"ring", text:"status"});

        if (this.gateway && this.key !== "") {
            this.on('input', (msg) => {
                let payload = msg.payload;
                let data = payload.data;
                if(payload.sid) {
                    if (payload.sid === this.sid) {
                        if (data.status && data.status === "on") {
                            this.status({fill:"green", shape:"dot", text:"on"});
                        } else if (data.status && data.status === "off") {
                            this.status({fill:"red", shape:"dot", text:"off"});
                        }
                        else if (data.status && data.status === "unknown") {
                            this.status({fill:"red", shape: "dot", text: "offline"})
                        }
                        this.send(msg);
                    }
                }
                // Prepare for request
                else {
                    miDevicesUtils.prepareForGatewayRequest(this, msg);
                    this.send(msg);
                }
            });
        }
    }

    RED.nodes.registerType("xiaomi-plug", XiaomiPlugNode);

};
