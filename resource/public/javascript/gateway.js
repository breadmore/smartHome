$(function () {
    enableButton(false);
    /**
     * table to cast DataTable
     * https://datatables.net/
     */
    var table = $('#dataTable').DataTable({
        // "ajax": "../ajax/data/objects.txt",
        // "columnDefs": [{
        //     "searchable": false,
        //     "orderable": false,
        //     "targets": 0
        // }],
        // "order": [[1, 'asc']]
    });

    /**
     * Select One Table Row Function
     */
    $('#dataTable tbody').on('click', 'tr', function () {
        var row = table.row($(this));
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            row.child.hide();
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var data = [{
                productId : "12965934",
                deviceId : "65934",
                objectId : "02.481.1.10.100.3030.10011.65934",
                type : "GasDetector"

            },
                {
                    productId : "12965935",
                    deviceId : "65935",
                    objectId : "02.481.1.10.100.3030.10011.65932",
                    type : "GasController"

                }];
            row.child(format(data)).show();
            // enableButton(true);
        }
    });

    /**
     * Delete Selected Row.
     * todo: delete database. & reload
     */
    $('#deleteButton').click(function () {
        table.row('.selected').remove().draw(false);
    });

    // $('#policyButton').on('shown.bs.modal', function(){
    //    $('policyModal').trigger('focus');
    // });
    // $('$policyButton').modal('show');

    $('#policyModal').on('show.bs.modal', function (e) {
        var btn = $(e.relatedTarget);
        console.log(table.row('.selected').data());
    });

});

function enableButton(isEnabled) {
    if (isEnabled) {
        $('#policyButton').removeAttr('disabled');
        $('#deleteButton').removeAttr('disabled');
    }
    else {
        $('#policyButton').attr('disabled', 'disabled');
        $('#deleteButton').attr('disabled', 'disabled');
    }

}

/* Formatting function for row details - modify as you need */
function format(data) {
    // `d` is the original data object for the row
    let tr = '';
    if (data instanceof Array) {
        // tr += '+';
        data.forEach(function(item) {
            tr += '<tr> ' +
                '<td>' + item.productId + '</td>' +
                '<td>' + item.deviceId +'</td>' +
                '<td>' + item.objectId +'</td>' +
                '<td>' + item.type +'</td>' +
                '</tr>'
        });
    }

    let table = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;width:100%;" class="inner-table table table-striped-" ">' +
        '<tr style="">' +
        '<td>Product ID</td>' +
        '<td>Device ID</td>' +
        '<td>Object ID</td>' +
        '<td>Type</td>' +
        '</tr>';

    table += tr;
    table += '</table>';
    return table;

    // return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
    //     '<tr>' +
    //         '<td>Full name</td>' +
    //         '<td>Extension number</td>' +
    //     '</tr>' +
    //     '<tr>' +
    //     '   <td>' + data.name + '</td>' +
    //         '<td>' + data.extn + '</td>' +
    //     '</tr>' +
    //     '<tr>' +
    //     '   <td>Extra info:</td>' +
    //         '<td>And any further details here (images etc)...</td>' +
    //     '</tr>' +
    //     '</table>';
}