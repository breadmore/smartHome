var recentTemperature = [];
var recentHumidity = [];
var temperatureChart;
var humidityChart;

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

    let socket = io.connect('/');

    initXiaomiDeviceData(socket);
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
    setTimeout(function () {
        socket.emit('/legacy/states');
    }, 1000);
    socket.on('/legacy/states', function (data) {
        if (currentState.window === undefined || currentState.human === undefined || currentState.gasB === undefined || currentState.gasD === undefined) {
            currentState.window = data.window_detector;
            currentState.human = data.human_detector;
            currentState.gasD = data.gas_detector;
            currentState.gasB = data.gas_blocker;
        }
        updateLegacyStates(data);
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


    //////////////FFM
    // var socket = io();


    //
    // socket.on('recodr2',function (data) {
    //     console.log(data);
    // })

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
            document.getElementById('record').disabled = false;
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

            document.getElementById('record').onclick = function () {
                this.disabled = true;
                document.getElementById('stop').disabled = false;
                camSocket.emit('stop');
                camSocket.emit('record');
                console.log("record start");
            };

            document.getElementById('stop').onclick = function () {
                this.disabled = true;
                document.getElementById('record').disabled = false;
                // console.log("record stop");
            }
        });

        // console.log('open modal');
        // console.log(startCamSocket);
        // if (!startCamSocket) {
        //     console.log('startcam');
        //     startCamSocket = socket.emit('/startcam');
        // }
        // socket.emit('/startcam');
        // socket.on('start', function (cou) {
        //     console.log('connect start');
        //     // var divSocket, div = document.getElementById('ipcamera');
        //     // var camImage = document.getElementById('camImage');
        //
        //     // var canvas = document.getElementById('ipcamera-canvas');
        //
        //     var ipcamera = document.getElementById('ipcamera');
        //     var divSocket,
        //         div = document.createElement('div');
        //     var html = '';
        //     // for (var i = 0; i < cou; i++) {
        //     // 	html += '<option value="/cam' + i + '">Cam ' + i + '</option>';
        //     // }
        //     // html += '</select>';
        //     html += "<canvas width='640' height='360'>";
        //     div.innerHTML = html;
        //     var canvas = div.getElementsByTagName('canvas')[0];
        //     // select = div.getElementsByTagName('select')[0];
        //     // select.onchange = function() {
        //     //c
        //     // };
        //     /////////
        //     // if (divSocket) {
        //     //     console.log('divSocket disconn');
        //     //     divSocket.disconnect();
        //     //     document.getElementById('record').disabled = true;
        //     // }
        //     // console.log(this.value);
        //     // console.log("asdasdasds");
        //     if(camSocket) {
        //         console.log('disconnect camSocket');
        //         camSocket.disconnect();
        //     }
        //     camSocket = io(location.origin + '/cam0');
        //     // camSocket = divSocket;
        //     // console.log(camSocket);
        //     camSocket.on('data', function (data) {
        //         console.log('data');
        //         document.getElementById('record').disabled = false;
        //         var bytes = new Uint8Array(data);
        //         var blob = new Blob([bytes], {type: 'application/octet-binary'});
        //         var url = URL.createObjectURL(blob);
        //         var img = new Image;
        //         var ctx = canvas.getContext("2d");
        //         img.onload = function () {
        //             URL.revokeObjectURL(url);
        //             ctx.drawImage(img, 0, 0);
        //         };
        //         img.src = url;
        //         img.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
        //         // var bytes = new Uint8Array(data);
        //         // camImage.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
        //     });
        //
        //     ///////
        //     // ipcamera.appendChild(div);
        //
        //     document.getElementById('record').onclick = function () {
        //         this.disabled = true;
        //         document.getElementById('stop').disabled = false;
        //         socket.emit('record', 1);
        //         console.log("record start");
        //     };
        //
        //     document.getElementById('stop').onclick = function () {
        //         this.disabled = true;
        //         document.getElementById('record').disabled = false;
        //         // console.log("record stop");
        //     }
        // });
        // socket.emit('/startcam');
        // socket.on('start', function (cou) {
        //     console.log('start!!');
        //     // var divSocket;
        //         // div = document.createElement('div');
        //     // var html = '';
        //     // for (var i = 0; i < cou; i++) {
        //     // 	html += '<option value="/cam' + i + '">Cam ' + i + '</option>';
        //     // }
        //     // html += '</select>';
        //     // html += "<canvas width='640' height='360'>";
        //     // div.innerHTML = html;
        //
        //     // select = div.getElementsByTagName('select')[0];
        //     // select.onchange = function() {
        //     //
        //     // };
        //     /////////
        //     // if (camSocket) {
        //     //     camSocket.disconnect();
        //     //     document.getElementById('record').disabled = true;
        //     //     camSocket.close();
        //     // }
        //     // console.log(this.value);
        //     // console.log("asdasdasds");
        //
        //
        //     ///////
        //     // ipcamera.appendChild(div);
        //
        //     document.getElementById('record').onclick = function () {
        //         this.disabled = true;
        //         document.getElementById('stop').disabled = false;
        //         socket.emit('record', 1);
        //         console.log("record start");
        //     }
        //
        //     document.getElementById('stop').onclick = function () {
        //         this.disabled = true;
        //         document.getElementById('record').disabled = false;
        //         // console.log("record stop");
        //     }
        //
        // });

    });

    $('#ip-camera').on('hidden.bs.modal', function (e) {
        console.log('close modal');
        camSocket.emit('stop');
        // if (camSocket) {
        //     console.log('camsocket disconnected');
        //     camSocket.disconnect();
        // }
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

/////////////////

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
    // todo: jaesil or not jaesil check
    if (state.mode === undefined || state.mode === null) {
        // jaesil == 0;
        state.mode = 1;
    }

    if (state.mode !== 0) {
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
        currentState.window = state.window_detector;
    }
    if (currentState.human !== state.human_detector) {
        console.log("human changed!");
        currentState.human = state.human_detector;
    }
    if (currentState.gasB !== state.gas_blocker) {
        console.log("gasB changed!");
        currentState.gasB = state.gas_blocker;
    }
    if (currentState.gasD !== state.gas_detector) {
        console.log("gasD changed!");
        currentState.gasD = state.gas_detector;
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
