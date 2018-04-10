$(function () {

    $(".click").on("click", function () {
        console.log("Asd");

        var data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
        var data2 = [11,21,31,41,51,61,71,81,91,101,111,121,131,141,151,161,171,181,191,201,211,221,231,241]
        var data3 = [100,120,130,140,150,160,170,180,190,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440]

        myChart.data.datasets[0].data = data;
        myChart.data.datasets[1].data = data2;
        myChart.data.datasets[2].data = data3;

        myChart.options.title.text = "2018-04-10";

        myChart.update();
    });
    // console.log("!23123");

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
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
                display : true,
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
            }
        }
    });

    ////////////////////////
    ////////////////////////

    Chart.data.datasets.forEach(function (e) {
        e.hidden = true;
    });



});