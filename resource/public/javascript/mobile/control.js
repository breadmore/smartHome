$(function () {
    /** Xiaomi Power Plug Action Contoller*/
    $('#xiaomiPowerController').on('click', function (e) {
        if (!$('#xiaomiPower').prop('checked')) {
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'on'});
        }
        else {
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'off'});
        }
    });
});

function xiaomiAction(action) {
    $.ajax({
        url: '../api/v1/xiaomi/action',
        type: 'post',
        data: action,
        success: function (result) {

        },
        error: function (err) {
            console.log(err);
        }
    })
};
