//var dbController = require('../../../src/web/api/v1/DbTestController');

// var gatewayList = [
//     {
//         id: "12965901",
//         name: 'Gateway_Room',
//         ip : '10.0.0.2',
//         port: 3000,
//         conn: 0
//
//     },
//     {
//         id: "2",
//         name: 'Gateway_Living',
//         ip : '10.0.0.3',
//         port: 3000,
//         conn: 0
//     }
// ];

var gatewayList;
var deviceList;
var securityList = [];
var entityList;
var resourceList = [];
var nowClick;
var chkCheckBox; // ktw add
var change; //ktw add

$(document).ready(function () {
    //init device list & device detail
    createDeviceListView();
    createResourceName();
    // Security DataTable.
    var table = $('#securityTable').DataTable({
        paging: false,
        processing: true,
        ordering: true,
        serverSide: false,
        searching: true,
        // dom: 't<"row no-gutters default-bottom-margin"<"col"><"col"p><"col">>',
        dom: '<"row no-gutters"t>',
        ajax: {
            url: "/api/v1/security",
            dataSrc: function (jsonArray) {
                // console.log(jsonArray);
                // return jsonArray;

                $.ajax({
                    url: 'api/v1/security/entities',
                    type: 'get',
                    async: false,
                    success: function (entities) {
                        entityList = entities;
                        $.each(jsonArray, function (index, item) {
                            item.enforceDate = dateFormatter(item.policyID);
                            item.fromName = findEntityById(item.FromID).Name;
                            item.toName = findEntityById(item.ToID).Name;
                            securityList.push(item);
                        });
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                return securityList;

            }
        },
        columns: [
            {data: "enforceDate"},
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
    var loading = setInterval(function () {
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
    }, 1000);

    $("#save-Gateway").on("click", () => {

        var data = {
            id: $("#save-gateway-id").val(),
            name: $("#save-gateway-name").val(),
            ip: $("#save-ipaddress").val(),
            port: $("#save-port").val(),
            conn: $("#gateway-connected input:radio[name=optradio]:checked").val()
        }
        // console.log(data);
        saveGateway(data);
    });

    $("#save-Device").on("click", () => {
        var data = {
            did: $("#add-device-id").val(),
            psk: $("#add-pre-shared-key").val(),
            oid: $("#add-object-id").val(),
            eid: $("#add-entity-id").val(),
            sid: $("#add-session-id").val(),
            type: $("#add-type option:selected").val(),
            conn: $("#add-connection input:radio[name=optradio]:checked").val(),
            auth: $("#add-authentication input:radio[name=optradio2]:checked").val(),
            reg: $("#add-registered input:radio[name=optradio3]:checked").val(),
            dname: $("#add-device-name").val(),
            gwid: $("#add-gateway-id option:selected").val()
        };
        saveDevice(data);
    });

    // $(document).on('click','.device-list', function (e) {
    //     nowClick = this;
    //     console.log(nowClick);
    // });
    $("#deleteButton").on("click", () => {
        deleteResourceClicked();
    });
    $("#refresh").on("click", () => {
        window.location.reload();
    });

    //ktw add
    $(".form-check-input").on("click", () => {
        crudnListner();
    });

    $("#policyButton").on("click", () => {
        chkCheckBox = '';

        if(table.row('.selected').data().CreationYn === 'Y'){
            $("#chkC").attr('checked', true);
            chkCheckBox += 'C';
        }
        // else{
        //     $("#chkC").removeAttr('checked');
        //     $("#chkC").attr('checked', false);
        // }
        if(table.row('.selected').data().ReadYn === 'Y'){
            $("#chkR").attr('checked', true);
            chkCheckBox += 'R';
        }
        // else{
        //     $("#chkR").removeAttr('checked');
        //     $("#chkC").attr('checked', false);
        // }
        if(table.row('.selected').data().UpdateYn === 'Y'){
            $("#chkU").attr('checked', true);
            chkCheckBox += 'U';
        }
        // else{
        //     $("#chkU").removeAttr('checked');
        //     $("#chkC").attr('checked', false);
        // }
        if(table.row('.selected').data().DeleteYn === 'Y'){
            $("#chkD").attr('checked', true);
            chkCheckBox += 'D';
        }
        // else{
        //     $("#chkD").removeAttr('checked');
        //     $("#chkC").attr('checked', false);
        // }
        if(table.row('.selected').data().NotifyYn === 'Y'){
            $("#chkN").attr('checked', true);
            chkCheckBox += 'N';
        }
        // else{
        //     $("#chkN").removeAttr('checked');
        //     $("#chkC").attr('checked', false);
        // }

        $("#policy-confirm").attr('disabled', true);
    });
    $('#deployLogModal').on('show.bs.modal',function (e) {
        deployLogTable.ajax.reload();

    });
    $('#modifyModal').on('show.bs.modal', function (e) {

        if(nowClick.getAttribute('data-did') !== null) {
            var device = findDeviceByDid(nowClick.getAttribute('data-did'))
            $("#gateway-id").val(device.gwid);
            $("#device-name").val(nowClick.getAttribute('data-did'));
            $("#device-id").val(device.id);
            $("#pre-shared-key").val(device.psk);
            $("#entity-id").val(device.eid);
            $("#object-id").val(device.oid);
            $("#type").val(device.type);
            $("#session-id").val(device.sid)

            if ('<i class="fas fa-toggle-off"></i>' === device.conn) {
                $('#connected').html(device.conn + ' Not Connected');
            }
            else $('#connected').html(device.conn + ' Connected');
            if ('<i class="far fa-address-card"></i>' === device.auth) {
                $('#authenticate').html(device.auth + ' Not Authorized');
            }
            else $('#authenticate').html(device.auth + ' Authorized');
            if ('<i class="far fa-eye-slash"></i>' === device.reg) {
                $('#regster').html(device.reg + ' Not Registered');
            } else
                $('#regster').html(device.reg + ' Registered');
        }

    });
    $("#policy-confirm").on("click", () => {

        var tmp =  table.row('.selected').data();
        console.log(tmp);

        var policy = {
        };

        var updateData = {
            fromId: tmp.FromID,
            toId: tmp.ToID,
            resourceName: tmp.Resouce,
            tokenId: tmp.TokenID,
            operation: change
        };
        console.log(updateData);

        $.ajax({
            url: "api/v1/security",
            type: "PUT",
            data: updateData,
            dataType: 'json',
            success: function(result) {
                window.location.reload();
                console.log(result);
            },
            error: function (err) {
                console.log(err);
            }
        });


    });
    $('#securityTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            enableButton(false);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            enableButton(true);
            // console.log(table.row('.selected').data());
        }
    });

    var deployLogTable = $('#logTable').DataTable({
        paging: true,
        processing: true,
        ordering: true,
        serverSide: false,
        searching: true,
        dom : '<"row no-gutters"t>',
        ajax : {
            url: "/api/v1/Logs/policy",
            dataSrc: function (result) {
                var logs = [];
                $.each(result, function(index, item){
                    item.enforceDate = dateFormatter(item.enforce_date);
                    item.fromName = findEntityById(item.from_id.toString()).Name;
                    item.toName = findEntityById(item.to_id.toString()).Name;
                    logs.push(item);
                });
                return logs;
            }},
        columns : [
            {data: "enforceDate"},
            {data: "fromName"},
            {data: "toName"},
            {data: "resource_name"},
            {data: "pre_operation"},
            {data: "current_operation"}
        ]
    });


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
    $.each(entityList, function (index, item) {
        if (item.ID === id) {
            idx = index;
        }
    });
    if (idx !== -1) {
        return entityList[idx];
    }
    return null;
}

function findDeviceByDid(did) {
    var idx = -1;
    $.each(deviceList,function (index, item){
        if (item.did === did) {
            idx = index;
        }
    });

    if (idx !== -1) {
        return deviceList[idx];
    }
    return null;
}
function findOperationById() {
    $.each(deviceList, function (dIdx, device) {
        var count = 0;
        var entityName = [];
        var toName = [];
        var entityName_unique = [];
        var toName_unique = [];
        $.each(securityList, function (sIdx, security) {
            if (dIdx == 0) {
                count++;
                entityName.push(security.EntityName);
                toName.push(security.toName);
                if (count = sIdx) {
                    // $.each(entityName, function(i, el){
                    //     if($.inArray(el, entityName_unique) === -1) entityName_unique.push(el);
                    // });
                    // $.each(toName, function(i, el){
                    //     if($.inArray(el, toName_unique) === -1) toName_unique.push(el);
                    // });
                    // for (var i=0; i<entityName_unique.length; i++) {
                    //     $("#form-Id").append("<option>" + entityName_unique[i] +"</option>");
                    // }
                    // for (var i=0; i<toName_unique.length; i++) {
                    //     $("#to-Id").append("<option>" + toName_unique[i] +"</option>");
                    // }
                    $.each(entityName, function (i, el) {
                        $("#form-Id").append("<option>" + entityName[i] + "</option>");
                    });
                    $.each(toName, function (i, el) {
                        $("#to-Id").append("<option>" + toName[i] + "</option>");
                    });
                }
            }
            ;
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

/**
 * Select Only One Table Row Function
 */


// todo: policy button enable setting example.
// enableButton(false);
function enableButton(isEnabled) {
    if (isEnabled) {
        $('#policyButton').removeAttr('disabled');
        // $('#deleteButton').removeAttr('disabled');
    }
    else {
        $('#policyButton').attr('disabled', 'disabled');
        // $('#deleteButton').attr('disabled', 'disabled');
    }
}

// todo : modal data preset data example.
// $('#addButton').click(function () {
// var insertObj = {};
//
// if($("#add-gateway-id").val() != null) insertObj.gateway_id = $("#add-gateway-id").val();
// if($("#add-type").val() != null) insertObj.type = $("#add-type").val();
// if($("#add-product-id").val() != null) insertObj.sid = $("#add-product-id").val();
// if($("#add-device-id").val() != null) insertObj.did = $("#add-device-id").val();
// //policy-id 꼭 채워야함
// insertObj.policy_id = 12321;
//
// if(isObjectEmpty(insertObj))
// alert("Nothing Input!!");
// else {
// $.ajax({
// type: 'POST',
// url: 'v1/db/device',
// data: insertObj,
// dataType: 'json',
// success: function(result) {
// console.log(result);
// }, error: function(err) {
// console.log(err);
// }
// });
//
// $('#addModal').modal('hide');
//
// setTimeout(function() {
// table.ajax.reload( null, false );
// },100);
// }
//
// });
//
// $('#addModal').on('show.bs.modal', function (e) {
// $("#add-product-id").val(null);
// $("#add-type").val(1);
// $("#add-gateway-id").val(111);
// $("#add-device-id").val(null);
// });
//
// $('#modifyModal').on('show.bs.modal', function (e) {
// //var btn = $(e.relatedTarget);
// //console.log(btn);
// //console.log(table.row('.selected').data());



/** add click listener to gateway title in device list view
 * 1. folding gateway title
 * 2. gateway detail information beside detail view
 * */
function addClickListenerToGatewayTitle() {
    var tree = document.querySelectorAll('ul.tree a:not(:last-child)');
    tree[tree.length - 1].addEventListener('click', function (e) {
        nowClick = e.target;
        var parent = e.target.parentElement;
        var classList = parent.classList;
        if (classList.contains("open")) {
            classList.remove('open');
            var opensubs = parent.querySelectorAll(':scope .open');
            for (var i = 0; i < opensubs.length; i++) {
                opensubs[i].classList.remove('open');
            }
        } else {
            $('.open').removeClass('open');
            classList.add('open');
            detailViewUpdate(findGatewayByDid(tree[tree.length - 1].dataset.id), null);
        }
    });

    function findGatewayByDid(id) {
        var idx = -1;
        $.each(gatewayList, function (index, item) {
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

    $.each(deviceInfoList, function (index, item) {
        item.addEventListener('click', function (e) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
                for (var i = 0; i < deviceInfoList.length; i++) {
                    if (i != index) {
                        $(deviceInfoList[i]).removeClass('selected');
                        console.log('remove!');
                    }
                }
            }
            nowClick = e.target.parentElement.parentElement;
            detailViewUpdate(null, findDeviceByDid(item.dataset.did));
        });
    });

    function findDeviceByDid(did) {
        var idx = -1;
        $.each(deviceList, function (index, item) {
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
        if ('<i class="fas fa-toggle-off"></i>' === gateway.conn)
            $('#gatewayConn').html(gateway.conn + ' Disconnected');
        else
            $('#gatewayConn').html(gateway.conn + ' Connected');

    }
    else if (device) {
        toggleTable(gateway, device);
        $('#gwid').html(device.gwid);
        $('#dname').html(device.dname);
        $('#dtype').html(device.type);
        $('#eid').html(device.eid);
        $('#oid').html(device.oid);
        $('#did').html(device.did);
        $('#psk').html(device.psk);
        $('#oid').html(device.oid);
        $('#sid').html(device.sid);
        if ('<i class="fas fa-toggle-off"></i>' === device.conn)
            $('#conn').html(device.conn + ' Disconnected');
        else
            $('#conn').html(device.conn + ' Connected');

        if ('<i class="far fa-address-card"></i>' === device.auth)
            $('#auth').html(device.auth + ' Unauthorized');
        else
            $('#auth').html(device.auth + ' Authorized');

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
    else if (device) {
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

    $.ajax({
        url: '/api/v1/gateways',
        type: 'get',
        success: function (gatewayResult) {

            $.each(gatewayResult, function (index, item) {
                item.conn = conn2Icon(item.conn);
            });
            gatewayList = gatewayResult;
            $.ajax({
                url: '/api/v1/devices',
                type: 'get',
                success: function (deviceResult) {
                    $.each(deviceResult, function (index, item) {
                        // console.log(bin2String(item.psk.data));
                        if (item.psk) {
                            item.psk = bin2String(item.psk.data);
                        }
                        else {
                            item.psk = "";
                        }
                        item.conn = conn2Icon(item.conn);
                        item.auth = auth2Icon(item.auth);
                        item.reg = regi2Icon(item.reg);
                        item.type = type2Icon(item.type);
                    });
                    deviceList = deviceResult;
                    // console.log(deviceList);
                    $.each(gatewayList, function (index, item) {
                        $('.tree').append(deviceListForm(item, deviceList));
                        addClickListenerToGatewayTitle();
                        $("#add-gateway-id").append("<option value=" + item.id + ">" + item.name + "</option>");
                    });
                    addClickListenerToDeviceInfo();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/** create gateway title + device info list in device list view*/
function deviceListForm(gateway, deviceList) {
    if (deviceList.length > 0) {
        var dom = '<li class="device-list"><a href="#" class="gateway-name " data-id=' + gateway.id + '>' + gateway.name + '</a><ul>';
        $.each(deviceList, function (index, item) {
            if (gateway.id === item.gwid) {
                dom += '<li class="device-info device-list" data-did=' + item.did + '>' +
                    '<label class="device-type">' + item.type + '</label>' +
                    '<label class="device-name">' + item.dname + '</label>' +
                    '<label class="device-conn" style="width:25px">' + item.conn + '</label>' +
                    '<label class="device-auth" style="width:25px">' + item.auth + '</label>' +
                    '<label class="device-reg" style="width:25px">' + item.reg + '</label>' +
                    '</li>'
            }
        });
        dom += '</ul></li>';
        return dom;
    }
    else {
        return null;
    }

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
    if (type === 1) {
        return icon = '<i class="fab fa-stumbleupon device-type-icon" ></i><span>GasDetector</span>'
    }
    else if (type === 2) {
        return icon = '<i class="fas fa-ban device-type-icon" ></i><span>GasBreaker</span>'
    }
    else if (type === 3) {
        return icon = '<i class="fas fa-thermometer-half device-type-icon" ></i><span>ThermoHytgrometer</span>'
    }
    else if (type === 4) {
        return icon = '<i class="far fa-lightbulb device-type-icon" ></i><span>SmartLighting</span>'
    }
    else if (type === 5) {
        return icon = '<i class="fas fa-video device-type-icon" ></i><span>IntrusionDetector</span>'
    }
    else if (type === 6) {
        return icon = '<i class="fas fa-home device-type-icon" ></i><span>DoorSensor</span>'
    }
    else if (type === 7) {
        return icon = '<i class="fas fa-plug device-type-icon" ></i><span>SmartPlug</span>'
    }
    else if (type === 8) {
        return icon = '<i class="fas fa-camera device-type-icon" ></i><span>SmartCamera</span>'
    }
    else {
        return icon = '<i class="fas fa-question"></i><span>Unknown</span>'
    }
    return icon;
}


function conn2Icon(conn) {
    var icon;
    if (conn === 0) {
        return icon = '<i class="fas fa-toggle-off"></i>'
    }
    else {
        return icon = '<i class="fas fa-toggle-on icon-on" ></i>'
    }
    return icon;
}

function auth2Icon(auth) {
    var icon;
    if (auth === 0) {
        return icon = '<i class="far fa-address-card"></i>'
    }
    else {
        return icon = '<i class="fas fa-address-card icon-on" ></i>'
    }
    return icon;
}

function regi2Icon(regi) {
    var icon;
    if (regi === 0) {
        return icon = '<i class="far fa-eye-slash"></i>'
    }
    else {
        return icon = '<i class="fas fa-eye icon-on" ></i>'
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

function dateFormatter(date) {
    var str = '';
    str += date.substring(0,4) + '년 ';
    str += date.substring(4,6) + '월 ';
    str += date.substring(6,8) + '일 ';
    str += date.substring(8,10) + '시 ';
    str += date.substring(10,12) + '분 ';
    return str;
}


function saveGateway(data) {
    var gateway_data = {
        "gateway": {
            "id": data.id,
            "name": data.name,
            "ip": data.ip,
            "port": data.port,
            "conn": data.conn
        }
    };
    $.ajax({
        url: '/api/v1/gateways',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(gateway_data),
        // datatype : "json",
        success: function (result) {
            // console.log(data);
            // console.log(result);
            // console.log("success");
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function saveDevice(data) {
    var device_data = {
        "auth": {
            "did": data.did,
            "psk": data.psk,
            "oid": data.oid,
            "eid": data.eid,
            "sid": data.sid,
            "type": data.type,
            "conn": data.conn,
            "auth": data.auth,
            "reg": data.reg,
            "dname": data.dname,
            "gwid": data.gwid
        }
    };

    // console.log(device_data);
    $.ajax({
        url: '/api/v1/devices',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(device_data),
        success: function (result) {
            // console.log(data);
            console.log(result);
            console.log("success");
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function createResourceName() {
    $.ajax({
        url: '/api/v1/security/resources',
        type: 'get',
        // contentType: "application/json; charset=utf-8",
        // data: JSON.stringify(device_data),
        success: function (result) {
            resourceList = result;
            $.each(resourceList, function (index, item) {
                $("#resource-Name").append("<option>" + item.Resource + "</option>")
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteResourceClicked() {
    console.log(nowClick);
    nowClick;
}

//ktw add

function test1() {
    var tmp = document.getElementsByClassName('form-check-input');
    var str;



    // console.log(tmp.item(1).checked);
    for ( let i = 0; i < tmp.length; i++){
        if (tmp.item(i).checked == true){
            console.log(tmp.item(i).value);
        }
    }

    // tmp = document.getElementById('form-Id');
    // console.log(tmp.selectedIndex);
    // console.log(tmp.selectedIndex);
}

function crudnListner() {
    var tmp = document.getElementsByClassName('form-check-input');
    change = '';

    for ( let i = 0; i < tmp.length; i++){
        if (tmp.item(i).checked == true){
            change += tmp.item(i).value;
        }
    }
    // console.log(change[0]);
    if(chkCheckBox === change){
        $('#policy-confirm').attr('disabled', true);
    }else{
        $('#policy-confirm').attr('disabled', false);
    }
}























