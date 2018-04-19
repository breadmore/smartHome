var recentTemperature = [];
var recentHumidity = [];
var temperatureChart;
var humidityChart;
var myChart_modal;

const NOT_DETECTED = 'Not Detected';
const DETECTED = 'Detected';

const OPENED = 'Opened';
const CLOSED = 'Closed';

var currentState = {};


var camSocket;
window.onbeforeunload = function () {
    if (camSocket) {
        console.log('disconnect cam');
        camSocket.disconnect();
        camSocket = undefined;
    }
};

$(function () {
    initEnvironmentData();

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
                data: [2, 2, 2.1, 2, 2.1, 2, 2.2, 2, 2.3, 1.9, 2.1, 2.3, 2.7, 2.8, 2.6, 2.8, 3.1, 2.3, 2.4, 2.3, 2, 2.1, 1.9],
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
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24" ],
            datasets: [
                {
                    label: 'Temperature',
                    radius: 1.5,
                    data: [13, 12, 12, 11, 11, 10, 10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 15, 14, 13, 13, 12, 12, 11, 11],
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
                    data: [85, 85, 85, 85, 85, 85,80, 75, 70, 65, 55, 45,45, 40, 40, 40, 40, 40,45, 45, 50, 55, 60, 60],
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
                    data: [110, 100, 100, 100, 130, 150,160, 190, 210, 230, 240, 250,270, 270, 260, 250, 240, 230,220, 210, 200, 180, 160, 120],
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
                display : false,
                text : '2018-04-11',
                fontSize : 17
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
                position : 'bottom'
            }
        }
    });


    let socket = io.connect('/');

    initXiaomiDeviceData();
    // todo : fix socket!
    socket.on('/environments/', function (data) {
        console.log(data);
        switch (data.type) {
            case 'temperature':
                $('#temperatureValue').text(data.value + '℃');
                recentTemperature.shift();
                recentTemperature.push(data.value);
                updateChart(temperatureChart, recentTemperature);
                break;
            case 'humidity':
                $('#humidityValue').text(data.value + '%');
                recentHumidity.shift();
                recentHumidity.push(data.value);
                updateChart(humidityChart, recentHumidity);
                break;
            case 'illuminati':
                console.log(data.value);
                $('#luxValue').text(data.value + 'Lux');
                break;
            default:
                console.error(data);
                break;
        }
    });

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
        console.log(currentState);
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
            currentState.led = data.led;
        }
        updateLegacyStates(data);
    });

    /** Xiaomi State Socket!
     *         udp              rest                  w/s
     * device ------> nodered  ------>  node server ------> dashboard
     *                                              ------> database
     */
    socket.on('/xiaomi/states', function (data) {
        // console.log(data);
        switch (data.type) {
            case 'magnet':
                if (data.event === 'open') {
                    $('#xiaomiWindow').text(OPENED);
                }
                else if (data.event === 'close') {
                    $('#xiaomiWindow').text(CLOSED);
                }
                else {
                    console.error('event is undefined');
                }
                break;
            case 'motion':
                if (data.event === 'motion') {
                    $('#xiaomiHuman').text(DETECTED);
                }
                else if (data.event === 'no_motion') {
                    $('#xiaomiHuman').text(NOT_DETECTED);
                }
                else {
                    console.error('event is undefined');
                    $('#xiaomiWindow').text(NOT_DETECTED);
                }
                break;
            case 'plug':
                if (data.event === 'on') {
                    $('#xiaomiPower').prop("checked", true);
                }
                else if (data.event === 'off') {
                    $('#xiaomiPower').prop("checked", false);
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
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'on'});
        }
        else {
            console.log($('#xiaomiPower').prop('checked'));
            xiaomiAction({plug: 'off'});
        }
    });

    /** room mode controller*/
    $('#roomModeController').on('click', function(e){
        if (!$('#roomState').prop('checked')) {
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, true)
            // xiaomiAction({plug: 'on'});
        }
        else {
            console.log($('#roomState').prop('checked'));
            legacyDeviceAction(2, false);
            // xiaomiAction({plug: 'off'});
        }
    });

    /** Light Controller*/
    $('#lightController').on('click', function (e) {
        if (!$('#lightState').prop('checked')) {
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, true);
        }
        else {
            console.log($('#lightState').prop('checked'));
            legacyDeviceAction(1, false);
        }
    });




    camSocket = io(location.origin + '/cam0');
    camSocket.emit('stop');
    camSocket.emit('init');
    $('#ip-camera').on('show.bs.modal', function (e) {
        camSocket.emit('stop');
        var ipcamera = document.getElementById('ipcamera');
        var canvas = ipcamera.getElementsByTagName('canvas')[0];
        camSocket.emit('start');
        camSocket.on('data', function (data) {
            console.log('data');
            // console.log(data);
            // document.getElementById('record').disabled = false;
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

            // document.getElementById('record').onclick = function () {
            //     this.disabled = true;
            //     // document.getElementById('stop').disabled = false;
            //     camSocket.emit('stop');
            //     camSocket.emit('record');
            //     console.log("record start");
            // };

            // document.getElementById('stop').onclick = function () {
            //     this.disabled = true;
            //     document.getElementById('record').disabled = false;
            //     // console.log("record stop");
            // }
        });


    });

    $('#ip-camera').on('hidden.bs.modal', function (e) {
        console.log('close modal');
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
            // console.log(result);
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
            // console.log(result);
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
            // console.log(result);
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
        state.mode = 0;
    }
    state.led = 1;

    console.log(state.led);
    if (state.led === 0) {
        $('#lightState').prop("checked", false);
    }
    else {
        $('#lightState').prop("checked", true);
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
        // console.log("window changed!");
        currentState.window = state.window_detector;
        sendSensorLog();
    }
    if (currentState.human !== state.human_detector) {
        // console.log("human changed!");
        currentState.human = state.human_detector;
        sendSensorLog();
    }
    if (currentState.gasB !== state.gas_blocker) {
        // console.log("gasB changed!");
        currentState.gasB = state.gas_blocker;
        sendSensorLog();
    }
    if (currentState.gasD !== state.gas_detector) {
        // console.log("gasD changed!");
        currentState.gasD = state.gas_detector;
        sendSensorLog();
    }

    if (currentState.mode !== state.mode) {
        // console.log("gasD changed!");
        currentState.gasD = state.gas_detector;
        sendSensorLog();
    }

    if (currentState.led !== state.led) {
        // console.log("gasD changed!");
        currentState.led = state.led;
        sendSensorLog();
    }
}


function xiaomiAction(action) {
    $.ajax({
        url: 'api/v1/xiaomi/action',
        type: 'post',
        data: action,
        success: function (result) {

        },
        error: function (err) {
            console.log(err);
        }
    })
}

function legacyDeviceAction(type, action) {
    // todo : ip address?
    var action = {
        'ip' : '',
        'type' : type,
        'turnOn' : action
    };

    $.ajax({
        url: 'api/v1/action',
        type: 'post',
        data: action,
        success: function(result) {
            console.log(result);
        },
        error : function(err) {
            console.log(err);
        }
    });
}

function sendSensorLog() {
    var log = {

    };

    $.ajax({
        url: 'api/v1/action/log',
        type: 'post',
        data: log,
        success: function(result) {
            console.log(result);
        },
        error : function(err) {
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
