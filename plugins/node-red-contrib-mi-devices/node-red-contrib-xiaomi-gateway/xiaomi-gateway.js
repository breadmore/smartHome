const dgram = require('dgram'); // Given by udp node
const miDevicesUtils = require('../src/utils');

// UDP node copy/paste...

module.exports = (RED) => {
    var udpInputPortsInUse = {};

    function XiaomiGatewayNode(config) {
        RED.nodes.createNode(this, config);
        this.gateway = RED.nodes.getNode(config.gateway);

        this.status({fill:"red", shape:"ring", text: "offline"});

        if (this.gateway) {
            this.on('input', (msg) => {
                var payload = msg.payload;

                // Input from gateway
                if(payload.sid) {
                    if (payload.sid == this.gateway.sid) {
                        if(payload.data.rgb) {
                            var decomposed = miDevicesUtils.computeColor(payload.data.rgb);
                            payload.data.brightness = decomposed.brightness;
                            payload.data.color = decomposed.color;
                        }
                        this.send([msg]);
                    }
                }
                // Prepare for request
                else {
                    msg.gateway = this.gateway;
                    msg.sid = this.gateway.sid;
                    this.send(msg);
                }
            });
        }
    }
    RED.nodes.registerType("xiaomi-gateway", XiaomiGatewayNode);

    // The Input Node
    function GatewayIn(n) {
        RED.nodes.createNode(this,n);
        this.gatewayNodeId = n.gateway;
        this.gateway = RED.nodes.getNode(n.gateway);
        this.group = "224.0.0.50";
        this.port = 9898;
        this.iface = null;
        this.addr = n.ip;
        this.ipv = this.ip && this.ip.indexOf(":") >= 0 ? "udp6" : "udp4";

        this.status({fill:"red", shape:"ring", text: "offline"});

        var opts = {type:this.ipv, reuseAddr:true};
        if (process.version.indexOf("v0.10") === 0) { opts = this.ipv; }
        var server;

        if (!udpInputPortsInUse.hasOwnProperty(this.port)) {
            server = dgram.createSocket(opts);  // default to udp4
            udpInputPortsInUse[this.port] = server;
        }
        else {
            this.warn(RED._("udp.errors.alreadyused",this.port));
            server = udpInputPortsInUse[this.port];  // re-use existing
        }

        if (process.version.indexOf("v0.10") === 0) { opts = this.ipv; }

        server.on("error", (err) => {
            if ((err.code == "EACCES") && (this.port < 1024)) {
                this.error(RED._("udp.errors.access-error"));
            } else {
                this.error(RED._("udp.errors.error",{error:err.code}));
            }
            server.close();
        });

        server.on('message', (message, remote) => {
            var msg;
            if(remote.address == this.addr) {
                var msg = message.toString('utf8');
                var jsonMsg = JSON.parse(msg);
                if(jsonMsg.data) {
                    jsonMsg.data = JSON.parse(jsonMsg.data) || jsonMsg.data;
                    if(jsonMsg.data.voltage) {
                        jsonMsg.data.batteryLevel = miDevicesUtils.computeBatteryLevel(jsonMsg.data.voltage);
                    }
                }
                msg = { payload: jsonMsg };
                if(this.gateway && jsonMsg.data.ip && jsonMsg.data.ip === this.gateway.ip) {
                    if(jsonMsg.token) {
                        this.gateway.lastToken = jsonMsg.token;
                        if(!this.gateway.sid) {
                            this.gateway.sid = jsonMsg.sid;
                        }
                    }
                    RED.nodes.eachNode((tmpNode) => {
                        if(tmpNode.type.indexOf("xiaomi-gateway") === 0 && tmpNode.gateway == this.gatewayNodeId) {
                            let tmpNodeInst = RED.nodes.getNode(tmpNode.id);
                            if(tmpNode.type === "xiaomi-gateway out" && !this.gateway.lastToken) {
                                tmpNodeInst.status({fill:"yellow", shape:"ring", text: "waiting input"});
                            }
                            tmpNodeInst.status({fill:"blue", shape:"dot", text: "online"});
                        }
                    });
                }
                this.send(msg);
            }
        });

        server.on('listening', () => {
            var address = server.address();
            this.log(RED._("udp.status.listener-at",{host:address.address,port:address.port}));
            server.setBroadcast(true);
            try {
                server.setMulticastTTL(128);
                server.addMembership(this.group,this.iface);
                this.log(RED._("udp.status.mc-group",{group:this.group}));
            } catch (e) {
                if (e.errno == "EINVAL") {
                    this.error(RED._("udp.errors.bad-mcaddress"));
                } else if (e.errno == "ENODEV") {
                    this.error(RED._("udp.errors.interface"));
                } else {
                    this.error(RED._("udp.errors.error",{error:e.errno}));
                }
            }
        });

        this.on("close", () => {
            if (udpInputPortsInUse.hasOwnProperty(this.port)) {
                delete udpInputPortsInUse[this.port];
            }
            try {
                server.close();
                this.log(RED._("udp.status.listener-stopped"));
            } catch (err) {
                //this.error(err);
            }
        });

        try { server.bind(this.port, this.iface); }
        catch(e) { } // Don't worry if already bound
    }
    RED.httpAdmin.get('/udp-ports/:id', RED.auth.needsPermission('udp-ports.read'), (req,res) => {
        res.json(Object.keys(udpInputPortsInUse));
    });
    RED.nodes.registerType("xiaomi-gateway in",GatewayIn);


    // The Output Node
    function GatewayOut(n) {
        RED.nodes.createNode(this,n);
        this.port = 9898;
        this.outport = 9898;
        this.iface = null;
        this.addr = n.ip;
        this.ipv = this.ip && this.ip.indexOf(":") >= 0 ? "udp6" : "udp4";
        this.multicast = false;

        this.gatewayNodeId = n.gateway;
        this.gateway = RED.nodes.getNode(n.gateway);

        this.status({fill:"red", shape:"ring", text: "offline"});

        var opts = {type:this.ipv, reuseAddr:true};
        if (process.version.indexOf("v0.10") === 0) { opts = this.ipv; }

        var sock;
        if (udpInputPortsInUse[this.outport]) {
            sock = udpInputPortsInUse[this.outport];
        }
        else {
            sock = dgram.createSocket(opts);  // default to udp4
            sock.on("error", (err) => {
                // Any async error will also get reported in the sock.send call.
                // This handler is needed to ensure the error marked as handled to
                // prevent it going to the global error handler and shutting node-red
                // down.
            });
            udpInputPortsInUse[this.outport] = sock;
        }

        if (!udpInputPortsInUse[this.outport]) {
            sock.bind(this.outport);
            this.log(RED._("udp.status.ready",{outport:this.outport,host:this.addr,port:this.port}));
        } else {
            this.log(RED._("udp.status.ready-nolocal",{host:this.addr,port:this.port}));
        }

        this.on("input", (msg) => {
            if (msg.hasOwnProperty("payload")) {
                var add = this.addr || msg.ip || "";
                var por = this.port || msg.port || 0;
                if (add === "") {
                    this.warn(RED._("udp.errors.ip-notset"));
                } else if (por === 0) {
                    this.warn(RED._("udp.errors.port-notset"));
                } else if (isNaN(por) || (por < 1) || (por > 65535)) {
                    this.warn(RED._("udp.errors.port-invalid"));
                } else {
                    if(msg.payload.cmd === "write" && !msg.payload.data.key && this.gateway && this.gateway.sid && this.gateway.key && this.gateway.lastToken) {
                        msg.payload.data.key = miDevicesUtils.getGatewayKey(this.gateway.key, this.gateway.lastToken);
                    }
                    var message = Buffer.from(JSON.stringify(msg.payload));
                    sock.send(message, 0, message.length, por, add, (err, bytes) => {
                        if (err) {
                            this.error("udp : "+err,msg);
                        }
                        message = null;
                    });
                }
            }
        });

        this.on("close", () => {
            if (udpInputPortsInUse.hasOwnProperty(this.outport)) {
                delete udpInputPortsInUse[this.outport];
            }
            try {
                sock.close();
                this.log(RED._("udp.status.output-stopped"));
            } catch (err) {
                //this.error(err);
            }
        });
    }
    RED.nodes.registerType("xiaomi-gateway out", GatewayOut);
}
