//var dbController = require('../../../src/web/api/v1/DbTestController');

$(function () {

    /**
     * table to cast DataTable
     * https://datatables.net/
     */
    var table = $('#dataTable').DataTable({
        paging: true,
        processing: true,
        ordering: true,
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/devices",
            dataSrc: function (jsonArray) {
                var result = [];
                $.each(jsonArray, function(index, item){
                    item.psk.data = bin2String(item.psk.data);

                    result.push(item);
                });

                return result;
            }},
        columns : [
            {data: "did"},
            {data: "psk.data"},
            {data: "oid"},
            {data: "eid"},
            {data: "sid"},
            {data: "gwid"},
            {data: "dname"},
            {data: "type"},
            {data: "conn"},
            {data: "auth"},
            {data: "reg"}
        ],
        // "columnDefs": [{
        //     "searchable": false,
        //     "orderable": false,
        //     "targets": 0
        // }],
        // "order": [[1, 'asc']],
    });

//     $("#dataTable").dataTable({
//         "bProcessing" : false,
//         "sAjaxSource" : "responses/item-list.json",
//         "sDom": '<"top"i>rt<"bottom"flp><"clear">',
//         "fnServerData" : function (sSource, aoData, fnCallback, oSettings) {
//
//             oSettings.jqXHR = $.ajax({
//                 "dataType": "json",
//                 "url": "/api/v1/devices",
//                 "data": aoData,
//                 "success": function(data) {
//                     console.log(data);
// //do your stuff here
// //                     transform2DataTableFormat(data);
// //finally call the original fn.
//                     fnCallback(data);
//                 }
//             });
//         },
//         "columnsDef" : [
//             {data: "did"},
//             {data: "psk"},
//             {data: "oid"},
//             {data: "eid"},
//             {data: "sid"},
//             {data: "gwid"},
//             {data: "dname"},
//             {data: "type"},
//             {data: "conn"},
//             {data: "auth"},
//             {data: "reg"}
//             ]
//
//     });

    /**
     * Select One Table Row Function
     */
    $('#dataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            enableButton(false);
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            enableButton(true);
            console.log(table.row('.selected').data());
        }
    });

    /**
     * Delete Selected Row.
     * todo: delete database. & reload
     */
    // controller를 쓰지 않은 이유 : rest api attack(?) 보안 상, 내부에서 처리 해주는게 낫지 않을까
    // then => how to handle error during interaction between dao and web action?
    $('#deleteButton').click(function () {
        //console.log(table.row('.selected').data);
        let delete_row_id = table.row('.selected').data().id;

        $.ajax({
            type: 'DELETE',
            url: 'v1/db/device/' + delete_row_id,
            dataType: 'json',
            success: function(result) {
                console.log(result);
            }, error: function(err) {
                console.log(err);
            }
        });

        table.row('.selected').remove().draw(false);
        enableButton(false);
    });

    $('#addButton').click(function () {
        var insertObj = {};

        if($("#add-gateway-id").val() != null) insertObj.gateway_id = $("#add-gateway-id").val();
        if($("#add-type").val() != null) insertObj.type = $("#add-type").val();
        if($("#add-product-id").val() != null) insertObj.sid = $("#add-product-id").val();
        if($("#add-device-id").val() != null) insertObj.did = $("#add-device-id").val();
        //policy-id 꼭 채워야함
        insertObj.policy_id = 12321;

        if(isObjectEmpty(insertObj))
            alert("Nothing Input!!");
        else {
            $.ajax({
                type: 'POST',
                url: 'v1/db/device',
                data: insertObj,
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                }, error: function(err) {
                    console.log(err);
                }
            });

            $('#addModal').modal('hide');
            
            setTimeout(function() {
                table.ajax.reload( null, false );
            },100);
        }

    });

    $('#addModal').on('show.bs.modal', function (e) {
        $("#add-product-id").val(null);
        $("#add-type").val(1);
        $("#add-gateway-id").val(111);
        $("#add-device-id").val(null);
    });

    $('#modifyModal').on('show.bs.modal', function (e) {
        //var btn = $(e.relatedTarget);
        //console.log(btn);
        //console.log(table.row('.selected').data());
        var data = table.row('.selected').data();
        $("#gateway-id").val(data.gateway_id);
        $("#product-id").val(data.sid);
        $("#device-id").val(data.did);
        $("#pre-shared-key").val(data.psk);
        $("#object-id").val(data.oid);
        $("#session-id").val(data.eid);
        $("#type").val(data.type);
        $("#connected").val(data.connect);
        $("#authenticate").val(data.auth);
        $("#policy").val(data.policy_id);
    });

    $('#saveButton').click(function () {
        var data = table.row('.selected').data();
        var updateObj = {};

        //console.log($("#product-id").val());
        if( $("#gateway-id").val() != data.gateway_id)
            updateObj.gateway_id = $("#gateway-id").val();
        if( $("#product-id").val() != data.sid)
            updateObj.sid = $("#product-id").val();
        if( $("#device-id").val() != data.did)
            updateObj.did = $("#device-id").val();
        if( $("#pre-shared-key").val() != data.psk)
            updateObj.psk = $("#pre-shared-key").val();
        if( $("#object-id").val() != data.oid)
            updateObj.oid = $("#object-id").val();
        if( $("#session-id").val() != data.eid)
            updateObj.eid = $("#session-id").val();                
        if( $("#type").val() != data.type)
            updateObj.type = $("#type").val();
        if( $("#connected").val() != data.connect)
            updateObj.connect = $("#connected").val();
        if( $("#authenticate").val() != data.auth)
            updateObj.auth = $("#authenticate").val();
        if( $("#policy").val() != data.policy_id)
            updateObj.policy_id = $("#policy").val();
        
        //console.log(updateObj);
        if(isObjectEmpty(updateObj))
            alert("Nothing Modified!!");
        else {
            $.ajax({
                type: 'PUT',
                url: 'v1/db/device/' + data.id,
                data: updateObj,
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                }, error: function(err) {
                    console.log(err);
                }
            });

            $('#modifyModal').modal('hide');
            
            setTimeout(function() {
                table.ajax.reload( null, false );
            },100);
        }
    });

    enableButton(false);

    function enableButton(isEnabled) {
        if (isEnabled) {
            $('#modifyButton').removeAttr('disabled');
            $('#deleteButton').removeAttr('disabled');
        }
        else {
            $('#modifyButton').attr('disabled', 'disabled');
            $('#deleteButton').attr('disabled', 'disabled');
        }
    }

    function isObjectEmpty(obj) {
        if (obj) {
          for (var prop in obj) {
            return false;
          }
        }
        return true;
    }
});


/**
 * Data Formatter
 * 1. bin2String => psk converter
 * 2. conn2Icon => connection converter
 */

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i]));
    }
    console.log(result);
    return result;
}

function conn2Icon(conn) {
    var icon = 'f042'

    if (conn === 0 ) {
        return '#f042'
    }
    else {
    }

    return icon;
}