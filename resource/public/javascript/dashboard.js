$(function () {

    var ctx = $("#myChart");

    Chart.defaults.global.legend.display = false;
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            datasets: [{
                tension: 0,
                radius: 0,
                label: 'apples',
                borderColor: "rgba(35, 189, 252)",
                data: [1,2,2.1,2,2.1,2,2.2,2,2.3,1.9,2.1,2.3,2.7,2.8,2.6,2.8,3.1,2.3,2.4,2.3,2,2.1,1.9],
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

    var ctx2 = $("#myChart2");

    Chart.defaults.global.legend.display = false;
    var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            datasets: [{
                tension: 0,
                radius: 0,
                label: 'apples',
                borderColor: "rgba(41, 209, 51)",
                data: [1,1,1.1,1,1.1,1,1.2,1,1.3,0.9,1.1,1.3,1.7,1.8,1.6,1.8,2.1,1.3,1.4,1.3,1,1.1,0.9],
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

});