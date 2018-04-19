$(function () {
    enableButton(false);
    /**
     * table to cast DataTable
     * https://datatables.net/
     */
    var table = $('#dataTable').DataTable({
        // "columnDefs": [{
        //     "searchable": false,
        //     "orderable": false,
        //     "targets": 0
        // }],
        // "order": [[1, 'asc']]
    });

    /**
     * dom example :  https://datatables.net/reference/option/dom
     *
     */
    var logTable = $('#logTable').DataTable({
        dom : "rtp"
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
        }
    });



    /**
     * Delete Selected Row.
     * todo: delete database. & reload
     */
    $('#deleteButton').click(function () {
        table.row('.selected').remove().draw(false);
        enableButton(false);
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