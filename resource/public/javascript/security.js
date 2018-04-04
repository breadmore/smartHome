$(function () {

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
     * Select One Table Row Function
     */
    $('#dataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    /**
     * Delete Selected Row.
     * todo: delete database. & reload
     */
    $('#deleteButton').click(function () {
        console.log(table.row('.selected'));
        table.row('.selected').remove().draw(false);
    });

});