var recentTemperature = [];
var recentHumidity = [];
var temperatureChart;
var humidityChart;

const NOT_DETECTED = 'Not Detected';
const DETECTED = 'Detected';

const OPENED = 'Opened';
const CLOSED = 'Closed';

var currentState = {};

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
    setInterval(function () {
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
            success: function(result) {
                console.log(result);
            },
            error : function(err) {
                console.log(err)
            }
        });
    }, 1500);

}
