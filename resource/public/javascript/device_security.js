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
var securityLogList;
var gatewayCheck;
$(document).ready(function () {

    // getAuthsList();

    $("#modi-button").on("click", function () {
        var updateDeviceObj = {};
        var updateGatewayObj={};

        if(gatewayCheck==true){
            updateGatewayObj.id=$("#gateway-id").val();
            updateGatewayObj.name=$("#gateway-name").val();
            updateGatewayObj.ip=$("#gateway-ip").val();
            updateGatewayObj.port=$("#gateway-port").val();
            updateGatewayObj.conn=$(':input:radio[name=moptradio]:checked').val();
            gatewayModify(updateGatewayObj);
        }else if(gatewayCheck==false){
            updateDeviceObj.conn = $(':input:radio[name=moptradio1]:checked').val();
            updateDeviceObj.auth = $(':input:radio[name=moptradio2]:checked').val();
            updateDeviceObj.id = $("#auth-id").val();
            updateDeviceObj.gwid=$("#device-gateway-id").val();
            updateDeviceObj.dname=$("#device-name").val();
            updateDeviceObj.did=$("#device-id").val();
            updateDeviceObj.psk=$("#pre-shared-key").val();
            updateDeviceObj.eid=$("#entity-id").val();
            updateDeviceObj.oid=$("#object-id").val();
            updateDeviceObj.type=$("#modi-device-type").val();
            updateDeviceObj.sid=$("#session-id").val();
            deviceModify(updateDeviceObj);
        }


    })


    $(".input-remove").click(function () {
        $("#addGatewayModal input[type=text]").val("");
        $("#addDeviceModal input[type=text]").val("");
        $("#addGatewayModal input[type=radio]").prop("checked", false);
        $("#addDeviceModal input[type=radio]").prop("checked", false);
    })

    //init device list & device detail
    createDeviceListView();
    // createResourceName();
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
                            item.enforceDate = dateFormatter(item.policyID,1);
                            item.fromName = findEntityById(item.FromID).Name;
                            // item.fromName = findDeviceByEid(Number(findEntityById(item.FromID).ID)).dname;      //this code is error. line 576 is same error.
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

        columnDefs: [
            { width: '18%', targets: 0 },
            { width: '12%', targets: 1 },
            { width: '9%', targets: 2 },
            { width: '12%', targets: 3 },
            { width: '11%', targets: 4 },
            { width: '11%', targets: 5 },
            { width: '11%', targets: 6 },
            { width: '11%', targets: 7 },
            { width: '11%', targets: 8 }
        ]

    });

    var securityEventTable = $('#securityEventTable').DataTable({
        paging: true,
        processing: true,
        order: [[1, 'desc']],
        serverSide: false,
        searching: true,
        dom: '<"row no-gutters"t>',
        ajax: {
            url: "/api/v1/logs",
            dataSrc: function (result) {
                console.log(result);
                check(result);

                $.each(result, (index, item) => {
                    item.event_date = dateFormatter(item.event_date,2);
                    // item.event_date = da(item.event_date);
                    // item.device_type = type2Icon(item.device_type);
                    var dataDid = {did: ''};
                    dataDid.did = item.device_id;
                    $.ajax({
                        url:'/api/v1/logs/authseid',
                        type:'post',
                        async: false,
                        data: dataDid,
                        success: function (auths) {
                            item.device_id = auths[0].eid;
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    })
                });


                return result;
            }
        },
        columns: [
            {data: "event_date"},
            {data: "event_type"},
            {data: "device_type"},
            {data: "device_id"},
            {data: "msg"}
        ],
        columnDefs: [
            { width: '200', targets: 0 },
            { width: '110', targets: 1 },
            { width: '115', targets: 2 },
            { width: '110', targets: 3 },
            // { width: '502', targets: 4 },

        ]
    });
    setInterval(() => {
        securityEventTable.ajax.reload();
    }, 3000);

    var isLoading = true;
    var loading = setInterval(function () {
        if (isLoading) {
            if (deviceList !== undefined && securityList !== undefined && gatewayList !== undefined) {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('deviceDiv').style.display = 'flex';
                document.getElementById('securityDiv').style.display = 'flex';
                document.getElementById('securityEvent').style.display = 'flex';
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
            eid: $("#add-device-id").val(),
            psk: $("#add-pre-shared-key").val(),
            oid: $("#add-object-id").val(),
            did: $("#add-entity-id").val(),
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

    $("#refresh").on("click", () => {
        window.location.reload();
    });

    //ktw add
    $('#from-Id').attr('disabled', true);
    $('#to-Id').attr('disabled', true);
    $('#resource-Name').attr('disabled', true);
    $('#policy-confirm').attr('disabled', true);
    $('#policyButton').attr('disabled', true);
    $('#modifyButton').attr('disabled', true);
    $('#deleteButton').attr('disabled', true);

    $('.radio-server').attr('checked', true);

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


        $("#from-Id").val(table.row('.selected').data().fromName);

        $("#to-Id").val(table.row('.selected').data().toName);

        $("#resource-Name").val(table.row('.selected').data().Resouce);


        $("#policy-confirm").attr('disabled', true);
    });
    $('#deployLogModal').on('show.bs.modal',function (e) {
        deployLogTable.ajax.reload();

    });

    $('#modifyModal').on('show.bs.modal', function (e) {
        if (nowClick.getAttribute('data-did') !== null) {
            $('.error-modify').hide();
            $('.gateway-modify').hide();
            $('.device-modify').show();
            var device = findDeviceByDid(nowClick.getAttribute('data-did'));
            console.log(device);
            $("#auth-id").val(device.id);
            $("#device-gateway-id").val(device.gwid);
            $("#device-name").val(device.dname);
            $("#device-id").val(device.eid);
            $("#pre-shared-key").val(device.psk);
            $("#entity-id").val(device.did);
            $("#object-id").val(device.oid);
            var modiDtype = icon2Type(device.type);
            $("#modi-device-type").val(modiDtype);
            $("#session-id").val(device.sid);
            if ('<i class="fas fa-toggle-off"></i>' === device.conn) {
                $('#conn-off').attr("checked", true);
            }
            else {
                $('#conn-on').attr("checked",true);
            }

            if ('<i class="far fa-address-card"></i>' === device.auth) {
                $('#auth-off').attr("checked", true);
            }
            else {
                $('#auth-on').attr("checked",true);
            }
            if ('<i class="far fa-eye-slash"></i>' === device.reg) {
                $('#regi-off').attr("checked", true);
            }
            else{
                $('#regi-on').attr("checked",true);
            }
        }
        else if(nowClick.getAttribute('data-id') !== null){
            $('.error-modify').hide();
            $('.gateway-modify').show();
            $('.device-modify').hide();
            var device = findGatewayById(nowClick.getAttribute('data-id'));
            $("#gateway-id").val(device.id);
            $("#gateway-name").val(device.name);
            $("#gateway-ip").val(device.ip);
            $("#gateway-port").val(device.port);
            if ('<i class="fas fa-toggle-off"></i>' === device.conn)
                $('#gateway-conn-off').attr("checked",true);
            else $('#gateway-conn-on').attr("checked",true);
        }
        else{
            $('.error-modify').show();
            $('.gateway-modify').hide();
            $('.device-modify').hide();
            $('#modi-button').hide();
        }
    });
    $('#modifyModal').on('hide.bs.modal', function (e) {
        $("#device-gateway-id").val(null);
        $("#device-name").val(null);
        $("#device-id").val(null);
        $("#pre-shared-key").val(null);
        $("#entity-id").val(null);
        $("#object-id").val(null);
        $("#modi-device-type").val(null);
        $("#session-id").val(null);
        $("#connected").val(null);
        $("#authenticate").val(null);
        $("#register").val(null);
        $('#modi-button').show();

    })
    $('#deleteModal').on('show.bs.modal', function (e) {
        var device;
        var url;

        if (nowClick.getAttribute('data-did') !== null) {
            device = findDeviceByDid(nowClick.getAttribute('data-did'));
            console.log(device);
            $("#del-name").html(device.type + ' - ' + device.dname);
        }
        else if(nowClick.getAttribute('data-id')) {
            device = findGatewayById(nowClick.getAttribute('data-id'));
            $("#del-name").html(device.name);
        }
        if(gatewayCheck==true){
            console.log("true");
            url='/api/v1/gateways/' + device.id;
        }
        else url = '/api/v1/devices/' + device.id

        console.log(device);
        $('#delete-User').click(function () {
            $.ajax({
                            type: 'DELETE',
                            url: url,
                            dataType: 'json',
                            success: function(result) {
                                console.log(result);
                                window.location.reload();
                            }, error: function(err) {
                                console.log(err);
                            }
                        });
            enableManageButton(false);
        })
    });
    $('#deleteModal').on('hide.bs.modal', function (e) {

    })

    $("#policy-confirm").on("click", () => {

        var tmp = table.row('.selected').data();
        console.log(tmp);
        var policyEnforcementPoint = $('.policy-radio:checked');

        var policy = {};

        var updateData = {
            fromId: tmp.FromID,
            toId: tmp.ToID,
            resourceName: tmp.Resouce,
            tokenId: tmp.TokenID,
            operation: change,
            enforcePoint: policyEnforcementPoint.val()
        };
        console.log(updateData);

        $.ajax({
            url: "api/v1/security",
            type: "PUT",
            data: updateData,
            dataType: 'json',
            success: function (result) {
                securityEventTable.ajax.reload();
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
        dom: '<"row no-gutters"t>',
        ajax: {
            url: "/api/v1/Logs/policy",
            dataSrc: function (result) {
                console.log(result);
                var logs = [];
                $.each(result, function (index, item) {
                    item.enforceDate = dateFormatter(item.enforce_date,2);
                    item.fromName = findEntityById(item.from_id.toString()).Name;
                    item.toName = findEntityById(item.to_id.toString()).Name;
                    logs.push(item);
                });
                return logs;
            }
        },
        columns: [
            {data: "enforceDate"},
            {data: "fromName"},
            {data: "toName"},
            {data: "resource_name"},
            {data: "pre_operation"},
            {data: "current_operation"}
        ]
    });


    $('body > div:nth-child(3) > div > div:nth-child(4) > span').on('click', function (e) {
        console.log(table.row('.selected').data());
    })


});


// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//         if ((new Date().getTime() - start) > milliseconds){
//             break;
//         }
//     }
// }
function findGatewayById(id) {
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

function findDeviceByGwid(gwid) {
    var idx = -1;
    $.each(deviceList, function (index, item) {
        if (item.gwid === gwid) {
            idx = index;
        }
    });
    if (idx !== -1) {
        return deviceList[idx];
    }
    return null;
}

function findDeviceByEid(eid) {
    var idx = -1;
    $.each(deviceList, function (index, item) {
        if (item.eid === eid) {
            idx = index;
        }
    });

    if (idx !== -1) {
        return deviceList[idx];
    }
    return null;
}
function findGateWayeBydid(did) {
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
function findOperationById() {
    $.each(deviceList, function (dIdx, device) {
        var count = 0;
        var entityName = [];
        var entityId = [];
        var toName = [];
        var entityName_unique = [];
        var toName_unique = [];
        $.each(securityList, function (sIdx, security) {
            if (dIdx == 0) {
                count++;
                entityName.push(security.EntityName);
                entityId.push(security.EntityID);
                toName.push(security.toName);
                if (count = sIdx) {
                    // $.each(entityName, function(i, el){
                    //     if($.inArray(el, entityName_unique) === -1) entityName_unique.push(el);
                    // });
                    // $.each(toName, function(i, el){
                    //     if($.inArray(el, toName_unique) === -1) toName_unique.push(el);
                    // });
                    // for (var i=0; i<entityName_unique.length; i++) {
                    //     $("#from-Id").append("<option>" + entityName_unique[i] +"</option>");
                    // }
                    // for (var i=0; i<toName_unique.length; i++) {
                    //     $("#to-Id").append("<option>" + toName_unique[i] +"</option>");
                    // }
                    // $.each(entityName, function (i, el) {
                    //     $("#from-Id").append("<option>" + entityName[i] + "</option>");
                    //     // $("#from-Id").append("<option>" + findDeviceByEid(Number(entityId[i])).dname + "</option>");
                    // });
                    // $.each(toName, function (i, el) {
                    //     $("#to-Id").append("<option>" + toName[i] + "</option>");
                    // });
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
        console.log(entityName)
    });
}

/**
 * Select Only One Table Row Function
 */
function autoWriteDeviceName(type,id,name){
    console.log('call addDeviceType2Name');
    var typ = $(type).val();
    console.log(typ);
    console.log(typ === '1');
    if(typ === '1')  $(name).val('GasDetector_'+$(id).val());
    else if(typ === '2') $(name).val('GasBreaker_'+$(id).val());
    else if(typ === '3') $(name).val('ThermoHygrometer_'+$(id).val());
    else if(typ === '4') $(name).val('SmartLighting_'+$(id).val());
    else if(typ === '5') $(name).val('IntrusionDetector_'+$(id).val());
    else if(typ === '6') $(name).val('DoorSensor_'+$(id).val());
    else if(typ === '7') $(name).val('SmartPlug_'+$(id).val());
    else if(typ === '8') $(name).val('SmartCamera_'+$(id).val());
}

// todo: policy button enable setting example.
// enableButton(false);
function enableButton(isEnabled) {
    if (isEnabled) {
        $('#policyButton').removeAttr('disabled');
    }
    else {
        $('#policyButton').attr('disabled', 'disabled');
    }
}

function enableManageButton(isEnabled) {
    if (isEnabled) {
        $('#modifyButton').removeAttr('disabled');
        $('#deleteButton').removeAttr('disabled');
    }
    else {
        $('#modifyButton').attr('disabled','disabled');
        $('#deleteButton').attr('disabled', 'disabled');
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
    var deviceInfoList = $('.device-info');
    tree[tree.length - 1].addEventListener('click', function (e) {
        gatewayCheck=true;
        nowClick = e.target;
        var parent = e.target.parentElement;
        var classList = parent.classList;
        if (classList.contains("open")) {
            classList.remove('open');
            var opensubs = parent.querySelectorAll(':scope .open');
            for (var i = 0; i < opensubs.length; i++) {
                opensubs[i].classList.remove('open');
            }
            enableManageButton(false);
        } else {
            $('.open').removeClass('open');
            classList.add('open');
            for (var i = 0; i < deviceInfoList.length; i++) {
                $(deviceInfoList[i]).removeClass('selected');
            }
            detailViewUpdate(findGatewayByDid(tree[tree.length - 1].dataset.id), null);
            if(findDeviceByGwid(nowClick.getAttribute('data-id')) === null){
                console.log("no -data");
                console.log(gatewayCheck);
                enableManageButton(true);
            }
            else {
                console.log("data here");
                console.log(gatewayCheck);
                enableManageButton(false);
                $('#modifyButton').removeAttr('disabled');
            }
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
                enableManageButton(false);
            }
            else {
                $(this).addClass('selected');
                gatewayCheck=false;
                console.log(gatewayCheck);
                for (var i = 0; i < deviceInfoList.length; i++) {
                    if (i != index) {
                        $(deviceInfoList[i]).removeClass('selected');
                        console.log('remove!');

                        enableManageButton(true);

                    }
                }
            }
            nowClick = e.target;
            if(nowClick.getAttribute('data-did') === null) {
                nowClick = nowClick.parentElement;
                if (nowClick.getAttribute('data-did') === null) {
                    nowClick = nowClick.parentElement;
                    if (nowClick.getAttribute('data-did') === null) {
                        nowClick = nowClick.parentElement;
                        if (nowClick.getAttribute('data-did') === null) {
                            nowClick = nowClick.parentElement;
                        }
                    }
                }
            }
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
        console.log(device);
        var dataJson = {
            id : device.eid
        }
        $.ajax({
            url:'/api/v1/gateways/policy',
            type:'post',
            async: false,
            data: dataJson,
            success: function (result) {
                $.each(result, (index, item) => {
                    if (item.Operation === null) {
                        device.operation="";
                    }
                    else if(item.Operation!==null){
                        device.operation=item.Operation;
                    }
                    // console.log(index+" "+item.operation);
                })

            },
            error: function (error) {
                console.log(error);
            }
        })

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
        // console.log("ope : "+device.operation);
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
        async: false,
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
                        $("#device-gateway-id").append("<option value=" + item.id + ">" + item.name + "</option>");
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

function icon2Type(icon) {
    var type = 0;
    if (icon === '<i class="fab fa-stumbleupon device-type-icon" ></i><span>GasDetector</span>') {
        type = 1;
    }
    else if (icon === '<i class="fas fa-ban device-type-icon" ></i><span>GasBreaker</span>') {
        type = 2;
    }
    else if (icon === '<i class="fas fa-thermometer-half device-type-icon" ></i><span>ThermoHytgrometer</span>') {
        type = 3;
    }
    else if (icon === '<i class="far fa-lightbulb device-type-icon" ></i><span>SmartLighting</span>') {
        type = 4;
    }
    else if (icon === '<i class="fas fa-video device-type-icon" ></i><span>IntrusionDetector</span>') {
        type = 5;
    }
    else if (icon === '<i class="fas fa-home device-type-icon" ></i><span>DoorSensor</span>') {
        type = 6;
    }
    else if (icon === '<i class="fas fa-plug device-type-icon" ></i><span>SmartPlug</span>') {
        type = 7;
    }
    else if (icon === '<i class="fas fa-camera device-type-icon" ></i><span>SmartCamera</span>') {
        type = 8;
    }
    else {
        type = 0;
    }
    return type;
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

function dateFormatter(date, type) {
    if (type === 1) {
        var str = '';
        str += date.substring(0,4) + '년 ';
        str += date.substring(4,6) + '월 ';
        str += date.substring(6,8) + '일 ';
        str += date.substring(8,10) + '시 ';
        str += date.substring(10,12) + '분 ';
        return str;
    } else if (type === 2 ) {
        var str = '';
        str += date.substring(0,4) + '년 ';
        str += date.substring(5,7) + '월 ';
        str += date.substring(8,10) + '일 ';
        str += date.substring(11,13) + '시 ';
        str += date.substring(14,16) + '분 ';
        return str;
    } else {
        console.log("What?");
    }

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
            window.location.reload();
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
            window.location.reload();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// function createResourceName() {
//     $.ajax({
//         url: '/api/v1/security/resources',
//         type: 'get',
//         // contentType: "application/json; charset=utf-8",
//         // data: JSON.stringify(device_data),
//         success: function (result) {
//             resourceList = result;
//             $.each(resourceList, function (index, item) {
//                 $("#resource-Name").append("<option>" + item.Resource + "</option>")
//             });
//         },
//         error: function (err) {
//             console.log(err);
//         }
//     });
// }


//ktw add

function test1() {
    // $('input.form-check-input:checked').each(function() {
    //     console.log($(this).val());
    // });

    var policyEnforcementPoint = $('.policy-radio').attr(checked, true);
}

function crudnListner() {
    var tmp = document.getElementsByClassName('form-check-input');
    change = '';

    for (let i = 0; i < tmp.length; i++) {
        if (tmp.item(i).checked == true) {
            change += tmp.item(i).value;
        }
    }
    // console.log(change[0]);
    if (chkCheckBox === change) {
        $('#policy-confirm').attr('disabled', true);
    } else {
        $('#policy-confirm').attr('disabled', false);
    }
}


function getAuthsList() {

        $.ajax({
            url:'/api/v1/devices',
            success: function (result) {

                // insertSecurityLog(result);

            },
            error: function (error) {
                console.log(error);
            }
        })

}

var device_type = {
    1 : "GasDetector",
    2 : "GasBreaker",
    3 : "ThermoHygrometer",
    4 : "SmartLighting",
    5 : "IntrusionDetector",
    6 : "DoorSensor",
    7 : "SmartPlug",
    8 : "SmartCamera"
}



function insertSecurityLog(data) {

    jsondata = {
        eventType : "security",
        deviceType : null,
        deviceId : null,
        msg : "authentication success"
    };



    $.each(data, (index, item) => {

        if (item.auth == 1) {

            /*if (item.type == 1) {
                jsondata.device_type = "GasDetector";
            } else if (item.type == 2) {
                jsondata.device_type = "GasBreaker";
            } else if (item.type == 3) {
                jsondata.device_type = "ThermoHygrometer";
            } else if (item.type == 4) {
                jsondata.device_type = "SmartLighting";
            } else if (item.type == 5) {
                jsondata.device_type = "IntrusionDetector";
            } else if (item.type == 6) {
                jsondata.device_type = "DoorSensor";
            } else if (item.type == 7) {
                jsondata.device_type = "SmartPlug";
            } else {
                jsondata.device_type = "SmartCamera";
            }*/
            jsondata.deviceType = item.type;
            jsondata.deviceId = item.did;
            $.ajax({
                url: '/api/v1/logs',
                type: 'post',
                data: jsondata,
                success: function (result) {
                    console.log("good");
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}

var before_critical = [];
var check_count = 0;
var test_array = [];
var first_msg = [];
var first_msg_count;

function check(data) {
    var after_critical = [];
    var tempArray = [];
    var overlapArray = [];
    $.each(data, function (index, item) {
        if (item.event_type === "critical"){
            test_array.push(item.id);
        }
    });
    if (test_array.length == 0) {
    } else {
        console.log("length 1111");
        if (check_count === 0) {
            check_count = 1;
            $.each(data, (index, item) => {
                if (item.event_type === "critical"){
                    before_critical.push(item.id);
                    first_msg.push(item.msg);
                    first_msg_count = 0;
                }
            });
        } else if (check_count === 1) {
            $.each(data, (index, item) => {
                if (item.event_type === "critical"){
                    after_critical.push(item.id);
                }
            });
            console.log("before length"+before_critical.length);
            if (before_critical.length == 1 && first_msg_count == 0) {
                alert(first_msg[0]);
                first_msg_count = 1;
            }
            $.each(before_critical, (index, item) => {
                $.each(after_critical, (sIndex, sItem) => {
                    if (item === sItem) {
                        tempArray.push(sItem);
                    } else if (item != sItem) {}
                });
                if (index === (before_critical.length-1)) {
                    // console.log("before_critical");
                    // console.log(before_critical);
                    before_critical.length = 0;
                    $.each(after_critical, (aindex, aitem) => {
                        before_critical.push(aitem);
                    });
                    // console.log("before_critical");
                    // console.log(before_critical);
                    // console.log("after_critical");
                    // console.log(after_critical);
                    $.each(tempArray, (tindex, tItem) => {
                        after_critical.splice($.inArray(tItem, after_critical), 1);
                    });
                    // console.log("after_critical");
                    // console.log(after_critical);
                    overlapArray = after_critical;
                    // console.log("등록된것");
                    // console.log(overlapArray);
                    if (overlapArray.length > 0) {
                        $.each(data, (oindex, oitem) => {
                            // console.log(oitem.id);
                            if (overlapArray == oitem.id) {
                                alert(oitem.msg);
                            }
                        })
                        // alert(overlapArray);
                    }

                }
            });
        }
    }

}

function deviceModify(device) {
    var url = '/api/v1/devices/';


    $.ajax({
        url: url + device.id,
        type: 'put',
        data: device,
        success: function (result) {
            console.log(result);
            window.location.reload();
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function gatewayModify(gateway) {
    var url = '/api/v1/gateways/';

    $.ajax({
        url: url + gateway.id,
        type: 'put',
        data: gateway,
        success: function (result) {
            window.location.reload();
            console.log(result);
        },
        error: function (error) {
            console.log(error);
        }
    });

}









