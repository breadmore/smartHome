//var dbController = require('../../../src/web/api/v1/DbTestController');

var gatewayList = [
    {
        id: "12965901",
        name: 'Gateway_Room',
        ip : '10.0.0.2',
        port: 3000,
        conn: 0

    },
    {
        id: "2",
        name: 'Gateway_Living',
        ip : '10.0.0.3',
        port: 3000,
        conn: 0
    }
];

var deviceList;
var securityList = [];
var entityList;

$(document).ready(function () {
    //init device list & device detail
    createDeviceListView();

    // Security DataTable.
    var table = $('#securityTable').DataTable({
        paging: false,
        processing: true,
        ordering: true,
        serverSide: false,
        searching: true,
        // dom: 't<"row no-gutters default-bottom-margin"<"col"><"col"p><"col">>',
        dom : '<"row no-gutters"t>',
        ajax : {
            url: "/api/v1/security",
            dataSrc: function (jsonArray) {
                // console.log(jsonArray);
                // return jsonArray;

                $.ajax({
                    url: 'api/v1/security/entities',
                    type:'get',
                    async: false,
                    success: function(entities){
                        entityList = entities;
                        $.each(jsonArray, function(index, item){
                            item.fromName = findEntityById(item.FromID).Name;
                            item.toName = findEntityById(item.ToID).Name;
                            securityList.push(item);
                        });
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
                return securityList;

            }},
        columns : [
            {data: "FromID"},
            {data: "fromName"},
            {data: "toName"},
            {data: "Resouce"},
            {data: "CreationYn"},
            {data: "ReadYn"},
            {data: "UpdateYn"},
            {data: "DeleteYn"},
            {data: "NotifyYn"}
        ],
    });

    var isLoading = true;
    var loading = setInterval(function() {
        if (isLoading) {
            if (deviceList !== undefined && securityList !== undefined && gatewayList !== undefined) {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('deviceDiv').style.display = 'flex';
                document.getElementById('securityDiv').style.display = 'flex';
            }
            findOperationById();
            isLoading = false;
            clearInterval(loading);
        }
    },1000);

});




// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//         if ((new Date().getTime() - start) > milliseconds){
//             break;
//         }
//     }
// }


function findEntityById(id) {
    var idx = -1;
    $.each(entityList, function(index, item){
        if (item.ID === id) {
            idx = index;
        }
    });
    if (idx !== -1) {
        return entityList[idx];
    }
    return null;
}

function findOperationById() {
    $.each(deviceList, function(dIdx, device){
        $.each(securityList, function(sIdx, security) {
            device.operation = {};
            if (device.eid === security.EntityID) {
                device.operation = operationJoiner(security);
            }
            else {
                device.operation = "";
            }
        });
    });
}

/** add click listener to gateway title in device list view
 * 1. folding gateway title
 * 2. gateway detail information beside detail view
 * */
function addClickListenerToGatewayTitle() {
    var tree = document.querySelectorAll('ul.tree a:not(:last-child)');
    tree[tree.length - 1].addEventListener('click', function(e) {
        var parent = e.target.parentElement;
        var classList = parent.classList;
        if(classList.contains("open")) {
            classList.remove('open');
            var opensubs = parent.querySelectorAll(':scope .open');
            for(var i = 0; i < opensubs.length; i++){
                opensubs[i].classList.remove('open');
            }
        } else {
            classList.add('open');
            detailViewUpdate(findGatewayByDid(tree[tree.length - 1].dataset.id), null);
        }
    });

    function findGatewayByDid(id) {
        var idx = -1;
        $.each(gatewayList, function(index, item){
            if (item.id === id) {
                idx = index;
            }
        });
        if (idx !== -1) {
            return gatewayList[idx];
        }
        return null;
    }
}

/** add click listener to device information in device list view
 * 1. device detail information beside detail view
 * */
function addClickListenerToDeviceInfo() {
    var deviceInfoList = $('.device-info');

    $.each(deviceInfoList, function(index, item){
        item.addEventListener('click', function(e){
            detailViewUpdate(null, findDeviceByDid(item.dataset.did));
        });
    });

    function findDeviceByDid(did) {
        var idx = -1;
        $.each(deviceList, function(index, item){
            if (item.did === did) {
                idx = index;
            }
        });
        if (idx !== -1) {
            return deviceList[idx];
        }
        return null;
    }
}

/** detail view table update
 * 1. toggle table(gateway table & device table)
 * 2. value change
 * */
function detailViewUpdate(gateway, device) {
    if (gateway) {
        toggleTable(gateway, device);
        $('#gatewayId').html(gateway.id);
        $('#gatewayName').html(gateway.name);
        $('#gatewayIP').html(gateway.ip);
        $('#gatewayPort').html(gateway.port);
        $('#gatewayConn').html(gateway.conn);

    }
    else if (device) {
        toggleTable(gateway, device);
        $('#gwid').html(device.gwid);
        $('#dname').html(device.dname);
        $('#type').html(device.type);
        $('#eid').html(device.eid);
        $('#oid').html(device.oid);
        $('#did').html(device.did);
        $('#psk').html(device.psk);
        $('#oid').html(device.oid);
        $('#sid').html(device.sid);
        $('#conn').html(device.conn);
        $('#auth').html(device.auth);
        $('#operation').html(device.operation);
    }
    else {
        console.log('error');
    }
}

/**
 * toggle table.
 * @param gateway : null -> gateway table will be show & device table will be gone.
 * @param device : null -> gateway table will be gone & device table will be show.
 */
function toggleTable(gateway, device) {
    var gatewayTable = document.getElementById('gatewayTable');
    var deviceTable = document.getElementById('deviceTable');
    if (gateway) {
        gatewayTable.style.display = 'block';
        deviceTable.style.display = 'none';
    }
    else if (device){
        deviceTable.style.display = 'block'
        gatewayTable.style.display = 'none';
    }
    else {
        console.log('err');
    }
}

/** create device list view
 * 1. request information to api server with crawiling.(gateway, device, security)
 * 2. create dom object and add click listener using other function
 * */

function createDeviceListView() {
    // todo : data crawling and save list.
    $.ajax({
        url: '/api/v1/devices',
        type: 'get',
        success: function(result) {
            // console.log(result);
            $.each(result, function(index, item){
                item.psk = bin2String(item.psk.data);
                item.conn = conn2Icon(item.conn);
                item.auth = auth2Icon(item.auth);
                item.reg = regi2Icon(item.reg);
                item.type= type2Icon(item.type);
            });
            deviceList = result;
            $.each(gatewayList, function(index, item){
                $('.tree').append(deviceListForm(item, result));
                addClickListenerToGatewayTitle();
            });
            addClickListenerToDeviceInfo();
        },
        error: function(err) {
            console.log(err);
        }
    });
}
/** create gateway title + device info list in device list view*/
function deviceListForm(gateway, deviceList) {
    var dom = '<li><a href="#" class="gateway-name" data-id=' + gateway.id +'>' + gateway.name +'</a><ul>';
    $.each(deviceList, function(index, item){
        if (gateway.id === item.gwid) {
            dom += '<li class="device-info" data-did=' + item.did + '>' +
                    '<label class="device-type">'+ item.type +'</label>' +
                    '<label class="device-name">'+ item.dname +'</label>' +
                    '<label class="device-conn">'+ item.conn +'</label>' +
                    '<label class="device-auth">'+ item.auth +'</label>' +
                    '<label class="device-reg">'+ item.reg +'</label>' +
                '</li>'
        }
    });
    dom += '</ul></li>';
    return dom;
}

/**
 * Data Formatter
 * 1. bin2String => psk converter
 * 2. conn2Icon => connection converter
 * 3. auth2Icon => authentication converter
 * 4. regi2Icon => registered converter
 * 5. type2Icon => devicetype converter
 * 6. operationJoiner
 */
function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i]));
    }
    return result;
}
function type2Icon(type) {
    var icon;
    if (type ===1) {
        return icon = '<i class="fab fa-stumbleupon"></i><span>GasDetector</span>'
    }
    else if(type === 2){
        return icon ='<i class="fas fa-ban"></i><span>GasBreaker</span>'
    }
    else if(type === 3){
        return icon ='<i class="fas fa-thermometer-half"></i><span>ThermoHytgrometer</span>'
    }
    else if(type === 4){
        return icon ='<i class="far fa-lightbulb"></i><span>SmartLighting</span>'
    }
    else if(type === 5){
        return icon ='<i class="fas fa-video"></i><span>IntrusionDetector</span>'
    }
    else if(type === 6){
        return icon ='<i class="fas fa-home"></i><span>DoorSensor</span>'
    }
    else{
        return icon ='<i class="fas fa-question"></i><span>Unknown</span>'
    }
    return icon;
}


function conn2Icon(conn) {
    var icon;
    if (conn === 0 ) {
        return icon = '<i class="fas fa-toggle-off"></i>'
    }
    else {
        return icon ='<i class="fas fa-toggle-on" style="color:green;"></i>'
    }
    return icon;
}

function auth2Icon(auth) {
    var icon;
    if (auth === 0 ) {
        return icon = '<i class="far fa-address-card"></i>'
    }
    else {
        return icon ='<i class="fas fa-address-card" style="color:green;"></i>'
    }
    return icon;
}

function regi2Icon(regi) {
    var icon;
    if (regi === 0 ) {
        return icon = '<i class="far fa-eye-slash"></i>'
    }
    else {
        return icon ='<i class="fas fa-eye" style="color:green;"></i>'
    }
    return icon;
}

function operationJoiner(security) {
    var operation = "";
    if (security) {
        if (security.CreationYn === 'Y') {
            operation += 'C';
        }
        if (security.ReadYn === 'Y') {
            operation += 'R';
        }
        if (security.UpdateYn === 'Y') {
            operation += "U";
        }
        if (security.DeleteYn === 'Y') {
            operation += "D";
        }
        if (security.NotifyYn === 'Y') {
            operation += "N";
        }
    }

    return operation;
}