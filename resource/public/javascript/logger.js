$(function () {

    var table = $('#eventTable').DataTable({
        paging: true,
        processing: true,
        // ordering: true,
        order: [[1, 'desc']],
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/logs/deviceall",
            dataSrc: function (result) {
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
    // // add index.
    // table.on('order.dt search.dt', function () {
    //     table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
    //
    // setInterval(function () {
    //     table.ajax.reload();
    // }, 1000 * 2)


});