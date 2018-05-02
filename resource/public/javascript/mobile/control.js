const Log = function ( eventType, deviceType, deviceId, msg) {
    this.eventType = eventType;
    this.deviceType = deviceType;
    this.deviceId = deviceId;
    this.msg = msg;
};

$(function () {
    /** Xiaomi Power Plug Action Contoller*/
    $('#xiaomiPowerController').on('click', function (e) {
        var log = new Log('log', '2', '12965946', '');
        if (!$('#xiaomiPower').prop('checked')) {
            log.msg = 'request plug outlet turn on.';
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'on'});
        }
        else {
            log.msg = 'request plug outlet turn off.';
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'off'});
        }
        sendLog(log);
    });

    $('#lightController').on('click', function (e) {
        var log = new Log('log', '4', '12965940', '');
        if (!$('#lightState').prop('checked')) {
            log.msg = 'request led light on.';
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, 1);
        }
        else {
            log.msg = 'request led light off.';
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, 0);
        }
        sendLog(log);
    });

    $('#roomModeController').on('click', function (e) {
        var log = new Log('service', '0', '12965932', '');
        if (!$('#roomState').prop('checked')) {
            log.msg = 'request jaesil mode on.';
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, 1);
        }
        else {
            log.msg = 'request jaesil mode off.';
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, 0);
        }
        sendLog(log);
    });
    
    let socket = io.connect('/');

    initXiaomiDeviceData();

    socket.on('/xiaomi/states', function (data) {
        console.log(data);
        switch (data.type){
            case 'plug':
                if (data.event === 'on'){
                    $('#xiaomiPower').prop("checked", true);
                }
                else if (data.event === 'off'){
                    $('#xiaomiPower').prop("checked", false);
                }
                break;
            default:
                break;
        }
    });

    setInterval(function () {
        socket.emit('/legacy/states');
    }, 1000);

    socket.on('/legacy/states', function (data) {        //sendLog is after.
        // console.log(data);
        if (data.mode === undefined){
            data.mode = 0;
        }

        if (data.led === 0){
            $('#lightState').prop("checked", false);
            setTimeout(function () {
                $('#lightState').removeAttr('disabled');
            },7 * 1000)
        }
        else if ( data.led === 1) {
            $('#lightState').prop("checked", true);
            setTimeout(function () {
                $('#lightState').removeAttr('disabled');

            },7 * 1000)
        }
        else {
            $('#lightState').attr('disabled', 'disabled');
        }

        if (data.mode === 0){
            $('#roomState').prop("checked", true);
        }
        else {
            $('#roomState').prop("checked", false);
        }

        if (data.mode === 0) {

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

function legacyDeviceAction(type, command){
    var ip = undefined;
    var msg;
    if ( type === 1 ) {
        ip = '192.168.0.100';
        if ( command === 0) {
            msg = 'request led light on.';
        }
        else {
            msg = 'request led light off.';
        }
    }
    else if( type === 2){
        ip = '192.168.0.100';
        if ( command === 0) {
            msg = 'request jaesil mode on.';
        }
        else {
            msg = 'request jaesil mode off.';
        }
    }
    else {
        console.log('device action err');
        return;
    }
    var action = {
        'ip': ip,
        'type': type,
        'turnOn': command
    }

    $.ajax({
        url: '/api/v1/action',
        type: 'post',
        data: action,
        success: function (result) {
            console.log(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function sendLog(log) {
    $.ajax({
        url: '/api/v1/logs',
        type: 'post',
        data : log,
        success: function(result) {
            // console.log(result);
        },
        error : function(err) {
            console.log('Error send Log!');
            console.log(err);
        }
    });
}

function initXiaomiDeviceData() {
    setTimeout(function () {
        $.ajax({
            url: '../api/v1/xiaomi/status',
            type: 'get',
            success: function (result) {
                // console.log(result);
            },
            error: function (err) {
                console.log(err)
            }
        });
    }, 1500);
}