var recentTemperature = [];
var recentHumidity = [];
var temperatureChart;
var humidityChart;
var myChart_modal;

const NOT_DETECTED = 'Not Detected';
const DETECTED = 'Detected';

const OPENED = 'Opened';
const CLOSED = 'Closed';

const ON_STAUTS = 'ON';
const OFF_STATUS = 'OFF';

var currentState = {
    window : undefined,
    human : undefined,
    gasB: undefined,
    gasD: undefined
};

var currentXiaomi = {
    magnet : undefined,
    motion : undefined,
    plug : undefined
};


var camSocket;
window.onbeforeunload = function () {
    if (camSocket) {
        console.log('disconnect cam');
        camSocket.disconnect();
        camSocket = undefined;
    }
};

$(document).ready(function() {

    var table = $('#eventTable').DataTable({
        paging: true,
        processing: true,
        // ordering: true,
        order: [[1, 'desc']],
        serverSide: false,
        searching: true,
        dom : '<"row no-gutters"t>',
        ajax : {
            url: "/api/v1/logs/recentservice",
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
    // add index.
    table.on('order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

    setInterval(function () {
        table.ajax.reload();
    }, 500);

    $(".environment_date").change(function () {
        getHourTemp($(".environment_date option:selected").val());
    });

    getHourTemp(1);

    initEnvironmentData();

    videoPlayer();
    // temperature Chart init.
    var ctx = $("#myChart");
    Chart.defaults.global.legend.display = false;
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            datasets: [{
                tension: 0,
                radius: 0,
                label: 'apples',
                borderColor: "rgba(35, 189, 252)",
                data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
                backgroundColor: "transparent"
            }]
        },
        options: {
            scales:
                {
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        }
                    }]
                }
        }
    });
    // humidity Chart init.
    var ctx2 = $("#myChart2");
    Chart.defaults.global.legend.display = false;
    humidityChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            datasets: [{
                tension: 0,
                radius: 0,
                label: 'apples',
                borderColor: "rgba(41, 209, 51)",
                data: [1, 1, 1.1, 1, 1.1, 1, 1.2, 1, 1.3, 0.9, 1.1, 1.3, 1.7, 1.8, 1.6, 1.8, 2.1, 1.3, 1.4, 1.3, 1, 1.1, 0.9],
                backgroundColor: "transparent"
            }]
        },
        options: {
            scales:
                {
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        }
                    }]
                }
        }
    });
    //all Chart
    var ctx_modal = $("#myChart-all");
    myChart_modal = new Chart(ctx_modal, {
        type: 'line',
        data: {
            labels: [5,10,15,20,25,30,35,40,45,50,55,60],
            datasets: [
                {
                    label: 'Temperature',
                    radius: 1.5,
                    data: [13, 12, 12, 11, 11, 10, 10, 11, 12, 13, 14, 15],
                    // backgroundColor: [
                    //     'rgba(35, 189, 252,0.2)',
                    // ],
                    borderColor: [
                        'rgba(35, 189, 252,1)',
                    ],
                    backgroundColor: "transparent",
                    borderWidth: 1
                }
                ,
                {
                    label: 'Humidity',
                    radius: 1.5,
                    data: [85, 85, 85, 85, 85, 85, 80, 75, 70, 65, 55, 45],
                    // backgroundColor: [
                    //     'rgba(41, 209, 51, 0.2)',
                    // ],
                    borderColor: [
                        'rgba(41, 209, 51,1)',
                    ],
                    backgroundColor: "transparent",
                    borderWidth: 1
                }
                ,
                {
                    label: 'Luminance',
                    radius: 1.5,
                    data: [110, 100, 100, 100, 130, 150, 160, 190, 210, 230, 240, 250],
                    // backgroundColor: [
                    //     'rgba(252, 100, 3, 0.2)',
                    // ],
                    borderColor: [
                        'rgba(252, 100, 3,1)',
                    ],
                    backgroundColor: "transparent",
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: false,
                text: '2018-04-11',
                fontSize: 17
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        // stepSize: 20,
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontSize: 18
                },
                position: 'bottom'
            }
        }
    });

    let socket = io.connect('/');


    initXiaomiDeviceData();
    /**
     * legacy device state update socket!
     *         mqtt             sql               sql               w/s
     * device -----> gateway -------> database <----- node server <------ dashboard
     *
     */
    setInterval(function () {
        socket.emit('/legacy/states');
    }, 1000);
    socket.on('/legacy/states', function (data) {
        if (currentState.window === undefined || currentState.human === undefined || currentState.gasB === undefined || currentState.gasD === undefined) {
            currentState.window = data.window_detector;
            currentState.human = data.human_detector;
            currentState.gasD = data.gas_detector;
            currentState.gasB = data.gas_blocker;

            if (data.mode) {
                currentState.mode = data.mode;
            }
            else {
                currentState.mode = undefined;
            }

            if (data.led) {
                currentState.led = data.led;
            }
            else {
                currentState.led = undefined;
            }
        }
        updateLegacyStates(data);
    });

    setInterval(function () {
        socket.emit('/environment');
    }, 1500);
    socket.on('/environment', function (data) {
        $('#temperatureValue').text(data.temperature[0].value + '℃');
        recentTemperature.shift();
        recentTemperature.push(data.temperature[0].value);
        updateChart(temperatureChart, recentTemperature);

        $('#humidityValue').text(data.humidity[0].value + '%');
        recentHumidity.shift();
        recentHumidity.push(data.humidity[0].value);
        updateChart(humidityChart, recentHumidity);
        // console.log(data.temperature[0].value);
        // console.log(data.humidity[0].value);
        // console.log(data.illuminaty.length);
        //todo [0].value addç
        // $('#luxValue').text(data.illuminaty[0].value);

    });

    /** Xiaomi State Socket!
     *         udp              rest                  w/s
     * device ------> nodered  ------>  node server ------> dashboard
     *                                              ------> database
     */
    socket.on('/xiaomi/states', function (data) {
        console.log(data);
        switch (data.type) {
            case 'magnet':
                if (currentXiaomi.magnet === undefined) {
                    currentXiaomi.magnet = data.event;
                }
                if (currentState.mode !== 0) {
                    if (data.event === 'open') {
                        $('#xiaomiWindow').text(OPENED);
                        // recordStart(1);
                    }
                    else if (data.event === 'close') {
                        $('#xiaomiWindow').text(CLOSED);
                    }
                    else {
                        console.error('event is undefined');
                    }
                }
                else {
                    $('#xiaomiWindow').text(NOT_DETECTED);
                }

                console.log(currentXiaomi.magnet);
                if (currentXiaomi.magnet !== data.event) {
                    console.log('magnet changed!');
                    if (currentXiaomi.magnet === 'open') {
                        sendLog('log', 'magnet closed.');
                        currentXiaomi.magnet = 'close';
                    }
                    else {
                        sendLog('log', 'magnet opened.');
                        currentXiaomi.magnet = 'open';
                    }
                }

                break;
            case 'motion':
                if (currentXiaomi.motion === undefined) {
                    currentXiaomi.motion = data.event;
                }
                if (currentState.mode !== 0) {
                    if (data.event === 'motion') {
                        $('#xiaomiHuman').text(DETECTED);
                        // recordStart(2);
                    }
                    else if (data.event === 'no_motion') {
                        $('#xiaomiHuman').text(NOT_DETECTED);
                    }
                    else {
                        console.error('event is undefined');
                        $('#xiaomiWindow').text(NOT_DETECTED);
                    }
                }
                else {
                    $('#xiaomiWindow').text(NOT_DETECTED);
                }

                if (currentXiaomi.motion !== data.event) {
                    console.log('motion changed!');
                    if (currentXiaomi.motion === 'no_motion') {
                        sendLog('log', 'motion is detected.');
                    }
                    else {
                        sendLog('log', 'motion is disappeared.');
                    }
                    currentXiaomi.motion = undefined;
                }

                break;
            case 'plug':
                if (currentXiaomi.plug === undefined) {
                    currentXiaomi.plug = data.event;
                }

                if (data.event === 'on') {
                    $('#xiaomiPower').prop("checked", true);
                    $('#plugStatus').text(ON_STAUTS);
                }
                else if (data.event === 'off') {
                    $('#xiaomiPower').prop("checked", false);
                    $('#plugStatus').text(OFF_STATUS);
                }

                if (currentXiaomi.plug !== data.event) {
                    console.log('plug changed!');
                    if (currentXiaomi.plug === 'on') {
                        sendLog('log', 'plug outlet is turned off.');
                    }
                    else {
                        sendLog('log', 'plug outlet is turned on.');
                    }
                    currentXiaomi.plug = undefined;
                }
                break;
            default:
                break;
        }


    });

    /**
     * todo : WebSocket fo Event Log!
     *          several ways..                      sql                 w/s
     * device ------> multiple server-> database <------ node server <---- dashboard EventLog
     */

    /** Xiaomi Power Plug Action Contoller*/
    $('#xiaomiPowerController').on('click', function (e) {
        if (!$('#xiaomiPower').prop('checked')) {
            // console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'on'});
        }
        else {
            // console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'off'});
        }
    });

    /** room mode controller*/
    $('#roomModeController').on('click', function (e) {
        if (!$('#roomState').prop('checked')) {
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, 0)
            // xiaomiAction({plug: 'on'});
        }
        else {
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, 1);
            // xiaomiAction({plug: 'off'});
        }
    });

    /** Light Controller*/
    $('#lightController').on('click', function (e) {
        if (!$('#lightState').prop('checked')) {
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, 0);
        }
        else {
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, 1);
        }
    });


    camSocket = io(location.origin + '/cam0');
    camSocket.emit('stop');
    camSocket.emit('init');
    $('#ip-camera').on('show.bs.modal', function (e) {
        display(true);
        modal_list();
        camSocket.emit('stop');
        var ipcamera = document.getElementById('ipcamera');
        var canvas = ipcamera.getElementsByTagName('canvas')[0];
        camSocket.emit('start');
        camSocket.on('data', function (data) {
            var bytes = new Uint8Array(data);
            var blob = new Blob([bytes], {type: 'application/octet-binary'});
            var url = URL.createObjectURL(blob);
            var img = new Image;
            var ctx = canvas.getContext("2d");

            img.onload = function () {
                URL.revokeObjectURL(url);
                ctx.drawImage(img, 0, 0);
            };
            img.src = url;
            img.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);

        });


    });

    $('#ip-camera').on('hidden.bs.modal', function (e) {
        camSocket.emit('stop');
    });

    function base64ArrayBuffer(arrayBuffer) {
        var base64 = '';
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var bytes = new Uint8Array(arrayBuffer);
        var byteLength = bytes.byteLength;
        var byteRemainder = byteLength % 3;
        var mainLength = byteLength - byteRemainder;
        var a, b, c, d;
        var chunk;
        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
            d = chunk & 63;               // 63       = 2^6 - 1
            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }
        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength];
            a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
            // Set the 4 least significant bits to zero
            b = (chunk & 3) << 4; // 3   = 2^2 - 1
            base64 += encodings[a] + encodings[b] + '==';
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
            a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
            // Set the 2 least significant bits to zero
            c = (chunk & 15) << 2; // 15    = 2^4 - 1
            base64 += encodings[a] + encodings[b] + encodings[c] + '=';
        }
        return base64;
    }

});

function initEnvironmentData() {
    //get Recent Temperature Values.
    $.ajax({
        url: '/api/v1/environments/temperature?number=24',
        type: 'get',
        success: function (result) {
            $.each(result.reverse(), function (index, item) {
                recentTemperature.push(item.value);
            });
            $('#temperatureValue').text(recentTemperature[result.length - 1] + '℃');
            temperatureChart.data.datasets[0].data = recentTemperature;
            temperatureChart.update();
        },
        error: function (err) {
            console.log(err);
        }
    });
    //get Recent Humidity Values.
    $.ajax({
        url: '/api/v1/environments/humidity?number=24',
        type: 'get',
        success: function (result) {
            $.each(result.reverse(), function (index, item) {
                recentHumidity.push(item.value);
            });
            $('#humidityValue').text(recentHumidity[result.length - 1] + '%');
            humidityChart.data.datasets[0].data = recentHumidity;
            humidityChart.update();
        },
        error: function (err) {
            console.log(err);
        }
    });

    //get Recent Illumination Values.
    $.ajax({
        url: '/api/v1/environments/humidity?number=24',
        type: 'get',
        success: function (result) {
            $.each(result.reverse(), function (index, item) {
                recentHumidity.push(item.value);
            });
            $('#humidityValue').text(recentHumidity[result.length - 1] + '%');
            humidityChart.data.datasets[0].data = recentHumidity;
            humidityChart.update();
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function updateChart(chart, chartData) {
    chart.data.datasets[0].data = chartData;
    chart.update();
}

function updateLegacyStates(state) {
    // console.log(state);
    // todo: jaesil or not jaesil check
    if (state.mode === undefined || state.mode === null) {
        state.mode = 1;
        currentState.mode = state.mode;
    }

    if (state.led === 0) {
        $('#lightState').removeAttr('disabled');
        $('#lightState').prop("checked", false);
        $('#lightStatus').text(OFF_STATUS);
    }
    else if (state.led === 1) {
        $('#lightState').removeAttr('disabled');
        $('#lightState').prop("checked", true);
        $('#lightStatus').text(ON_STAUTS);
    }
    else {
        $('#lightState').attr('disabled', 'disabled');
    }

    if (state.mode !== 0) {
        $('#roomState').prop("checked", false);

        if (state.window_detector === 0) {
            $('#legacyWindow').text(NOT_DETECTED);
        }
        else {
            // todo notify to detected state!
            $('#legacyWindow').text(DETECTED);
        }
        if (state.human_detector === 0) {
            $('#legacyHuman').text(NOT_DETECTED);
        }
        else {
            // todo notify to detected state!
            $('#legacyHuman').text(DETECTED);
        }
    }
    else {
        $('#roomState').prop("checked", true);

        $('#legacyWindow').text(NOT_DETECTED);
        $('#legacyHuman').text(NOT_DETECTED);
    }

    if (state.gas_detector === 0) {
        $('#gasDetector').text(NOT_DETECTED)
    }
    else {
        $('#gasDetector').text(DETECTED)
    }

    if (state.gas_blocker === 0) {
        $('#gasBlocker').text("Not Blocked")
    }
    else {
        $('#gasBlocker').text("Blocked")
    }

    // todo : if currentState has been changed then insert sensor log!
    if (currentState.window !== state.window_detector) {
        console.log("window changed!");
        if (currentState.window === 0) {
            sendLog('log', 'window opened.');
        }
        else {
            sendLog('log', 'windows closed.');
        }
        currentState.window = state.window_detector;
        // sendSensorLog();
    }

    if (currentState.human !== state.human_detector) {
        console.log("human changed!");
        if (currentState.human === 0) {
            sendLog('log', 'human detected.');
        }
        else {
            sendLog('log', 'human undetected.');
        }
        currentState.human = state.human_detector;
        // sendSensorLog();
    }
    if (currentState.gasB !== state.gas_blocker) {
        console.log("gasB changed!");
        currentState.gasB = state.gas_blocker;
        if (currentState.gasB === 0) {
            sendLog('log', 'gas unblocked.');
        }
        else {
            sendLog('log', 'gas blocked.');
        }
        // sendSensorLog();
    }
    if (currentState.gasD !== state.gas_detector) {
        console.log("gasD changed!");
        if (currentState.gasD === 0) {
            sendLog('log', 'gas undetected.');
        }
        else {
            sendLog('log', 'gas detected.');
        }
        currentState.gasD = state.gas_detector;
        // sendSensorLog();
    }

    // if (currentState.mode !== state.mode) {
    //     console.log("mode changed!");
    //     currentState.mode = state.mode;
    //     sendSensorLog();
    // }
    //
    // if (currentState.led !== state.led) {
    //     console.log("led changed!");
    //     currentState.led = state.led;
    //     sendSensorLog();
    // }
}


function xiaomiAction(action) {
    var data = {
        eventType : 'service',
        msg: undefined
    };
    console.log(action);

    if (action.plug === 'on') {
        data.msg = 'request plug outlet turn on.'
    }
    else {
        data.msg = 'request plug outlet turn off.'
    }

    console.log(data);

    $.ajax({
        url: '/api/v1/logs',
        type: 'post',
        data : data,
        success: function(result) {
            $.ajax({
                url: 'api/v1/xiaomi/action',
                type: 'post',
                data: action,
                success: function (result) {

                },
                error: function (err) {
                    console.log(err);
                }
            });
        },
        error : function(err) {
            console.log('Error send Log!');
            console.log(err);
        }
    });

}

function legacyDeviceAction(type, command) {
    // todo : ip address?
    var ip = undefined;
    var msg;
    if (type === 1) {
        ip = '192.168.0.20';
        if (command === 0) {

            msg = 'request led light on.';
        }
        else {
            msg = 'request led light off.';
        }
    }
    else if (type === 2) {
        ip = '192.168.0.21'
        if (command === 0) {
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
    };

    $.ajax({
        url: 'api/v1/action',
        type: 'post',
        data: action,
        success: function (result) {
            console.log(result);
            sendLog('service', msg);
        },
        error: function (err) {
            console.log(err);
        }
    });

}

function sendLog(eventType, msg) {
    var data = {
        eventType : eventType,
        msg: msg
    };
    console.log(data);
    $.ajax({
        url: '/api/v1/logs',
        type: 'post',
        data : data,
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
    /** request magnet(window) current state.
     *              read          read_ack
     * read status ------> device -------> gateway(nodered) -----> server -> dashboard
     *
     */
    // todo: waiting for socket ready state.
    setTimeout(function () {
        $.ajax({
            url: 'api/v1/xiaomi/status',
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
// function canvasDisplay(){
//     if ($("#myCanvas").css("display") == "none") {
//         $("canvas").toggle();
//         $("#videoName").toggle();
//     }
//     if ($("video").css("display") != "none"){
//         $("video").toggle();
//         $("#nowPlay").toggle();
//     }
// }
// function videoDisplay(){
//     if ($("canvas").css("display") != "none")
//     {
//         $("canvas").toggle();
//         $("#videoName").toggle();
//     }
//
//     if ($("video").css("display") == "none") {
//         $("video").toggle()
//         $("#nowPlay").toggle();
//     }
// }

function display(isCan) {
    if(isCan === true && $("canvas").css("display") === "none") {           //streaming
        $("canvas").toggle();
        // $("#videoName").toggle();
        $("video").toggle();
        $("#nowPlay").text("ON AIR...");
    }
    else if(isCan === false && $("canvas").css("display") !== "none") {     //videoplay
        $("canvas").toggle();
        // $("#videoName").toggle();
        $("video").toggle();
        // $("#nowPlay").toggle();
    }

}
function videoPlayer() {
    var video = document.getElementById('myVideo');
    var src = document.getElementById('vid');
    var btns = document.getElementsByClassName("myBtn");
    var change = document.getElementById('change');


    $(document).on('click', '.myBtn', function () {
        src.src = "/video/" + $(this).attr('data-name');
        // videoDisplay();
        display(false);
        $('#nowPlay').text($(this).attr('data-name'));

        video.load();

    })

    $(document).ready(function () {
        change.onclick = function () {
            display(true);
            // canvasDisplay();
            video.pause();
        };
    });
}

function modal_list() {
    $(".video-list").remove();

    $.ajax({
        type:"get",
        url:"/api/videos",
        success: function (data) {
            for(i=0; i<data.length; i++) {
                $(".my-video-list").append("<li class='video-list'>"+" <button class='myBtn video-btn' data-name="+data[i]+">"+data[i]+" </button> " +"</li>");
            }
        }
    })

}
/**
 *
 *
 * @param index==1 >>>>>>> window change
 *        index==2 >>>>>>> human change
 *        index==3 >>>>>>> myVideo Name
 */

function recordStart(index) {
    var videoName;
    var dd = new Date()
    var ss = '' + dd.getUTCFullYear() + 0+(dd.getMonth()+1) + dd.getDate() + dd.getHours()+ dd.getMinutes()+ dd.getSeconds()

    if(index==1){
        videoName='window_'+ss;
    }
    else if(index==2){
        videoName='human_'+ss;
    }
    else if(index==3){
        videoName=$("#videoName").val();
    }

    camSocket.emit('stop');
    camSocket.emit('record',videoName);
    // console.log("record start");

}



function getHourTemp(value) {
    var hour_min = {
        "min" : null,
        "hour" : null
    };
    var label = [];
    // console.log("value " + value);
    if (value == 1) {
        hour_min.min = 5;
        hour_min.hour = 1;
        getDataHour();
    } else if ( value == 2) {
        hour_min.min = 30;
        hour_min.hour = 6;
        getDataHour();
    } else if (value == 3) {
        hour_min.min = 60;
        hour_min.hour = 12;
        getDataHour();
    } else if (value == 4) {
        getDateDay();
    }

    function getDataHour() {
        $.ajax({
            url : "api/hourtemp",
            type : 'post',
            data : hour_min,
            success: function (result) {
                var new_data = [];
                var min;
                $.each(result, function (index, item) {
                    new_data.push(item.valueAvg);
                    if (item["min * " + hour_min.min] == 0) {
                        min = "00";
                    } else if (item["min * " + hour_min.min] == 5){
                        min = "05";
                    } else {
                        min = item["min * " + hour_min.min];
                    }
                    var time = '' + item.hour + ':' + min + '';
                    // console.log(time);
                    label.push(time);
                });
                myChart_modal.data.datasets[0].data = new_data;
                myChart_modal.data.labels = label;
                $.ajax({
                    url: "api/hourhumi",
                    type: 'post',
                    data: hour_min,
                    success: function (result) {
                        var new_data = [];
                        $.each(result, function (index, item) {
                            new_data.push(item.valueAvg);
                        });
                        myChart_modal.data.datasets[1].data = new_data;
                        $.ajax({
                            url: "api/hourillumi",
                            type: 'post',
                            data: hour_min,
                            success: function (result) {
                                var new_data = [];
                                $.each(result, function (index, item) {
                                    new_data.push(item.valueAvg);
                                });
                                myChart_modal.data.datasets[2].data = new_data;
                                myChart_modal.update();
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        })
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function getDateDay() {
        $.ajax({
            url : "api/daytemp",
            type : 'post',
            success: function (result) {
                var new_data = [];
                var min;
                $.each(result, function (index, item) {
                    new_data.push(item.valueAvg);
                    var time = '' + item.month + '/' + item.day + '';
                    label.push(time);
                });
                myChart_modal.data.datasets[0].data = new_data;
                myChart_modal.data.labels = label;
                $.ajax({
                    url: "api/dayhumi",
                    type: 'post',
                    success: function (result) {
                        var new_data = [];
                        $.each(result, function (index, item) {
                            new_data.push(item.valueAvg);
                        });
                        myChart_modal.data.datasets[1].data = new_data;
                        $.ajax({
                            url: "api/dayillumi",
                            type: 'post',
                            success: function (result) {
                                var new_data = [];
                                $.each(result, function (index, item) {
                                    new_data.push(item.valueAvg);
                                });
                                myChart_modal.data.datasets[2].data = new_data;
                                // myChart_modal.data.labels = label;
                                myChart_modal.update();
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        })
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            },
            error: function (error) {
                console.log(error);
            }
        });
    }


}