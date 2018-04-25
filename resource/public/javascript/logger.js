var entityList;
var securityList = [];


$(function () {

    var table = $('.devicelog').DataTable({
        paging: true,
        processing: true,
        // ordering: true,
        order: [[1, 'desc']],
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/logs/recentservice",
            dataSrc: function (result) {
                $.each(result, function (index, item) {
                    item.event_date = dateFormatter(item.event_date);
                })
                // console.log(result);
                return result;
            }},
        columns : [
            {data: null},
            {data: "event_date"},
            {data: "event_type"},
            // {data: "device_type"},
            {data: "msg"}
        ]
    });

    table.on('order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

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


    var deployLogTable = $('.deploylog').DataTable({
        paging: true,
        processing: true,
        ordering: true,
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