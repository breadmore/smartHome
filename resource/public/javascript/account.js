$(document).ready(function () {
    var table = $('#userTable').DataTable({
        paging: true,
        processing: true,
        ordering: true,
        serverSide: false,
        searching: true,
        ajax : {
            url: "/api/v1/users",
            dataSrc: function (result) {
                console.log(result);
                return result;
            }},
        columns : [
            {data: "user_id"},
            {data: "authority"},
            {data: "user_name"},
            {data: "email"},
            {data: "phone_number"},
            {data: "created_at"}
        ]
    });

    /**
     * Select One Table Row Function
     */
    $('#userTable tbody').on('click', 'tr', function () {
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
























