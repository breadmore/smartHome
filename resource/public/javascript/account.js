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
    $('#delete-User').click(function () {
        console.log('asdasd');
        let delete_row_id = table.row('.selected').data().user_id;
        console.log(delete_row_id);
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/users/' + delete_row_id,
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

    $('#save-User').click(function () {
        var insertObj = {};
        if($("#add-user-id").val() != null) insertObj.userId= $("#add-user-id").val();
        else alert("You must input your ID!!");

        if($("#add-user-password").val() != null) insertObj.password = $("#add-user-password").val();
        if($("#add-authority").val() != null) insertObj.authority = $("#add-authority").val();
        if($("#add-name").val() != null) insertObj.name = $("#add-name").val();
        if($("#add-e-mail").val() != null) insertObj.email = $("#add-e-mail").val();
        if($("#add-phone-number").val() != null) insertObj.phone = $("#add-phone-number").val();

        if($("#add-user-id").val() == '')
            alert("You must input USER ID!!");
        else {
            $.ajax({
                type: 'POST',
                url: '/api/v1/users',
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
        $("#add-user-id").val(null);
        $("#add-authority").val(null);
        $("#add-name").val(null);
        $("#add-e-mail").val(null);
        $("#add-phone-number").val(null);
    });

    $('#DeleteModal').on('show.bs.modal', function (e) {
        var data = table.row('.selected').data();
        $("#delete-id").text(data.user_id)
    });

    $('#ModifyModal').on('show.bs.modal', function (e) {
        //var btn = $(e.relatedTarget);
        //console.log(btn);
        //console.log(table.row('.selected').data());
        var data = table.row('.selected').data();
        $("#user-id").val(data.user_id);
        $("#user-password").val(data.password);
        $("#authority").val(data.authority);
        $("#name").val(data.user_name);
        $("#e-mail").val(data.email);
        $("#phone-number").val(data.phone_number);
        console.log(data);
    });

    $('#modify-User').click(function () {
        var data = table.row('.selected').data();
        var updateObj = {};

            updateObj.user_id = $("#user-id").val();
            updateObj.password = $("#user-password").val();
            updateObj.authority = $("#authority").val();
            updateObj.user_name = $("#name").val();
            updateObj.email = $("#e-mail").val();
            updateObj.phone_number = $("#phone-number").val();

        //console.log(updateObj);
        if($("#user-id").val() == '')
            alert("You must input USER ID!!");
        else {
            $.ajax({
                type: 'PUT',
                url: '/api/v1/users/' + data.id,
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
























