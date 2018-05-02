

var deviceList;

$(document).ready(function () {
    createDeviceListView();
    console.log(deviceList);
})


function createDeviceListView(){
    $.ajax({
        url: '/api/v1/devices',
        type: 'get',
        async: false,
        success:function (deviceResult) {
            deviceList=deviceResult;
            $.each(deviceList, function (index, item) {
                var dataJson = {
                    id : item.eid
                }
                $.ajax({
                    url:'/api/v1/gateways/policy',
                    type:'post',
                    async: false,
                    data: dataJson,
                    success: function (result) {
                        $.each(result, (rindex, ritem) => {
                            if (ritem.Operation === null) {
                                item.reg = "";
                            } else if (ritem.Operation !== null) {
                                item.reg = ritem.Operation;
                            }
                        });
                        console.log(result);
                        $('.device-page').append(deviceListForm(item));

                    },
                    error: function (error) {
                        console.log(error);
                    }
                })

            });
        }

    })

}

function deviceListForm(device){
    device.type=typeDefine(device.type);
    device.conn=connDefine(device.conn);
    device.auth=authDefine(device.auth);
    var dom='<div class="device-card">';
    dom+='<div class="col-12 device-card-top">';
    dom+='<div class="col-4 device-left"></div></div>';
    dom+='<div class="row col-12 device-card-body">';
    dom+='<div class="col-7 device-card-body-title">Device '+device.dname+'</div>';
    dom+=typeLabel(device.type);
    // dom+='<div class="col-5 device-card-body-title-right">'+type+'</div>';
    dom+='<div class="row device-card-body-content">';
    dom+='<div class="content-connect">Connected</div>';
    dom+='<div class="content-connect-value">'+device.conn+'</div>';
    dom+='<div class="content-auth">Authesntication</div>';
    dom+='<div class="content-auth-value">'+device.auth+'</div>';
    dom+='<div class="content-policy">Policy</div>';
    dom+='<div class="content-policy-value">'+device.reg+'</div>';
    dom+='</div></div></div>';

    return dom;
}

function typeDefine(type) {
    var itype;
    if (type === 1) {
        return itype = "GasDetector";
    }
    if (type === 2) {
        return itype = "GasBreaker";
    }
    if (type === 3) {
        return itype = "ThermoHygrometer";
    }
    if (type === 4) {

        return itype = "SmartLighting";
    }
    if (type === 5) {
        return itype = "IntrusionDetector";
    }
    if (type === 6) {
        return itype = "DoorSensor";
    }
    if (type === 7) {
        return itype = "SmartPlug";
    }
    if (type === 8) {
        return itype = "SmartCamera";
    }
    return itype;
}

function typeLabel(type) {
    var dom;
    if (type === "GasDetector") {
        console.log("asdasd");
        dom='<div class="col-5 device-card-body-title-right GasDetector">'+type+'</div>';
    }
    if (type === "GasBreaker") {
        dom='<div class="col-5 device-card-body-title-right GasBreaker">'+type+'</div>';
    }
    if (type === "ThermoHygrometer") {
        dom='<div class="col-5 device-card-body-title-right ThermoHygrometer">'+type+'</div>';
    }
    if (type === "SmartLighting") {
        dom='<div class="col-5 device-card-body-title-right SmartLighting">'+type+'</div>';
    }
    if (type === "IntrusionDetector") {
        dom='<div class="col-5 device-card-body-title-right IntrusionDetector">'+type+'</div>';
    }
    if (type === "DoorSensor") {
        dom='<div class="col-5 device-card-body-title-right DoorSensor">'+type+'</div>';
    }
    if (type === "SmartPlug") {
        dom='<div class="col-5 device-card-body-title-right SmartPlug">'+type+'</div>';
    }
    if (type === "SmartCamera") {
        dom='<div class="col-5 device-card-body-title-right SmartCamera">'+type+'</div>';
    }

    return dom;
}

function connDefine(conn) {
    var myConn=conn;
    if (myConn === 0) {
        return myConn = "Not Conn";
    }
    else {
        return myConn = "Conn";

    }
    return myConn;
}

function authDefine(auth) {
    var myAuth=auth;
    if (myAuth === 0) {
        return myAuth = "Not Auth";
    }
    else {
        return myAuth = "Auth";

    }
    return myAuth;
}