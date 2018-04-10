//var dbController = require('../../../src/web/api/v1/DbTestController');

$(function () {

    /**
     * open socket.
     */
    // let socket = io.connect('/');
    // socket.emit('/socket/devices');
    // socket.on('/socket/devices', function (data) {
    //     console.log(data);
    // });
    //
    //
    // /**
    //  * todo: socket connected by express.
    //  * legacy device socket. be fill with data.
    //  */
    // socket.on('/legacy', function (data) {
    //     console.log('lagacy data \n');
    //     console.log(data);
    //     if (data.type == "temperature") {
    //         $("#etri-temperature-value").text(data.value + " ℃");
    //     }
    //     if (data.type == "humidity") {
    //         $("#etri-humidity-value").text(data.value + " %");
    //     }
    //     if (data.status == "00") {
    //         $("#etri-window-detect").text("Undetected").css("color", "#23a455");
    //     } else if (data.status == "01") {
    //         $("#etri-window-detect").text("Detected").css("color", "#d72a42");
    //     } else if (data.status == "10") {
    //         $("#etri-human-detect").text("Undetected").css("color", "#23a455");
    //     } else if (data.status == "11") {
    //         $("#etri-human-detect").text("Detected").css("color", "#d72a42");
    //     } else if (data.status == "0") {
    //         $("#etri-gas-alram").text("Undetected").css("color", "#23a455");
    //     } else if (data.status == "1") {
    //         $("#etri-gas-alram").text("Detected").css("color", "#d72a42");
    //     } else if (data.status == "2") {
    //         $("#etri-gas-leackage").text("Gas Blocked").css("color", "#23a455").css("padding-top", "15px");
    //     } else if (data.status == "3") {
    //         $("#etri-gas-leackage").text("Gas None Blocked").css("color", "#d72a42").css("padding-top", "0px");
    //     } else if (data.status == "21" || data.status == "20" || data.status == "22") {
    //         jaesil_data = true;
    //         jaesil_true_false = false;
    //         $("#etri-jaesil-alram").siblings().find("input").attr("checked", true);
    //         $("#etri-jaesil-alram").text("Detected").css("color","#d72a42");
    //     }
    //
    // });
    //
    // var motion_data;
    // var jaesil_data;
    //
    // //todo : reporting data.  check model, status!
    // socket.on('/xiaomi/report', function (data) {
    //     console.log(data);
    //     if (data.model == "magnet") {
    //         $("#xiaomi-window-detect").text(data.data.status);
    //     } else if (data.model == "switch") {
    //         $("#xiaomi-switch-state").text(data.data.status);
    //     } else if (data.model == "plug") {
    //         if (data.data.status == "on") {
    //             $("#xiaomi-plug-state").siblings().find("input").attr("checked", true);
    //             $("#xiaomi-plug-state").text("ON");
    //         } else if (data.data.status == "off") {
    //             $("#xiaomi-plug-state").siblings().find("input").attr("checked", false);
    //             $("#xiaomi-plug-state").text("OFF");
    //         }
    //     } else if (data.model == "motion") {
    //         true_false = false;
    //         motion_data = data.model;
    //         $("#xiaomi-human-detect").text("Detected").css("color","#d72a42");
    //     }
    // });
    //
    // var count = 0;
    // var jaesil_count = 0;
    // var true_false = false;
    // var jaesil_true_false = false;
    //
    // setInterval(function() {
    //     if (motion_data == "motion" && true_false == false) {
    //         count++;
    //         if(count == 30) {
    //             true_false = true;
    //             $("#xiaomi-human-detect").text("Undetected").css("color","#23a455");
    //             count = 0;
    //         }
    //     }
    //     if (jaesil_data == true && jaesil_true_false == false) {
    //         jaesil_count++;
    //         if (jaesil_count == 30) {
    //             jaesil_true_false = true;
    //             $("#etri-jaesil-alram").text("Undetected").css("color","#23a455");
    //             $("#etri-jaesil-alram").siblings().find("input").attr("checked", false);
    //             jaesil_count = 0;
    //         }
    //     }
    // }, 1000);
    //
    // //todo : read data.  check model, status!
    // socket.on('xiaomi/read', function (data) {
    //     console.log(data);
    // });


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
        ajax : { url: "v1/db/device", dataSrc: ""},
        columns : [
            {data: "gateway_id"},
            {data: "sid"},
            {data: "did"},
            {data: "psk"},
            {data: "oid"},
            {data: "eid"},
            {data: "type"},
            {data: "connect"},
            {data: "auth"},
            {data: "policy_id"}
        ],
        // "columnDefs": [{
        //     "searchable": false,
        //     "orderable": false,
        //     "targets": 0
        // }],
        // "order": [[1, 'asc']],
    });

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