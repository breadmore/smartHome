var entityList;
var securityList = [];

var deviceList = [];

$(function () {

    $.ajax({
        url: '/api/v1/devices',
        type: 'get',
        async: false,
        success : function (result) {
            deviceList = result;
        },
        error: function (err) {
            console.log(err);
        }
    });


    var table = $('.devicelog').DataTable({
        paging: true,
        processing: true,
        ordering: true,
        order: [[0, 'desc']],
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/logs/serviceall",
            dataSrc: function (result) {
                // console.log(result);
                $.each(result, function (index, item) {
                    item.event_date = dateFormatter(item.event_date);
                    // item.device_name = findAuthByDid(item.device_id);
                    if (item.device_type == null) {
                        item.device_type = "";
                    } else if (item.device_type === "0"){
                        item.device_type = '<i class="fas fa-user-circle device-type-icon" ></i><span>Jaesil mode</span>';
                        // console.log("jasil");
                    } else {
                        item.device_type = type2Icon(item.device_type);
                        // console.log("else");
                    }

                });
                return result;
            }},
        columns : [
            // {data: null},
            {data: "event_date"},
            {data: "event_type"},
            {data: "device_name"},
            {data: "device_type"},
            {data: "device_id"},
            {data: "msg"}
        ],
        columnDefs: [
            { width: '260', targets: 0 },
            { width: '145', targets: 1 },
            { width: '160', targets: 2 },
            { width: '200', targets: 3 },
            { width: '125', targets: 4 },
            { width: '280', targets: 5 },
            // { width: '390', targets: 6 },

        ]
    });

    // table.on('order.dt search.dt', function () {
    //     table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();

    getEntityList();

    function getEntityList() {
                $.ajax({
                    url: "/api/v1/security",
                    success: function (jsonArray) {
                        // return jsonArray;
                        $.ajax({
                            url: 'api/v1/security/entities',
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
                });
    }

    var securityLogTable = $('.securitylog').DataTable({          // add by ktw
        paging: true,
        processing: true,
        ordering: false,
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/logs/securityall",
            dataSrc: function (result) {
                console.log(result);
                var logs = [];
                $.each(result, function(index, item){

                    item.event_date = dateFormatter(item.event_date);
                    item.device_type = type2Icon(item.device_type);
                    logs.push(item);


                });

                return logs;
            }},
        columns : [
            {data: "event_date"},
            {data: "event_type"},
            {data: "device_type"},
            {data: "device_id"},
            {data: "msg"}
        ],
    //     columnDefs: [
    //     { width: '260', targets: 0 },
    //     { width: '145', targets: 1 },
    //     { width: '200', targets: 2 },
    //     { width: '125', targets: 3 },
    //     { width: '440', targets: 4 },
    // ]
    });


    var deployLogTable = $('.deploylog').DataTable({
        paging: true,
        processing: true,
        ordering: false,
        // order: [[0, 'asc']],
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/Logs/deployall",
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
        ],
        columnDefs: [
            { width: '260', targets: 0 },
            { width: '200', targets: 1 },
            { width: '120', targets: 2 },
            { width: '190', targets: 3 },
            { width: '160', targets: 4 },
            { width: '240', targets: 4 },
        ]
    });

});

function dateFormatter(date) {
    var str = '';
    str += date.substring(0,4) + '년 ';
    str += date.substring(5,7) + '월 ';
    str += date.substring(8,10) + '일 ';
    str += date.substring(11,13) + '시 ';
    str += date.substring(14,16) + '분 ';
    return str;
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

function type2Icon(parseType) {
    var icon;
    var type = parseInt(parseType);
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
        return icon = '<i class="fas fa-question"></i><span></span>'
    }
    return icon;
}

function findAuthByDid(did) {
    var dname = '';
    deviceList.forEach(function (item, index) {
        if (item.did === did) {
            dname = item.dname;
            return dname;
        }
    });
    return dname;
};