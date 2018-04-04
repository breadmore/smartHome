$(function () {

    /**
     * open socket.
     */
        // let socket = io.connect('/');
        // socket.emit('/socket/devices');
        // socket.on('/socket/devices', function (data) {
        //     console.log(data);
        // });
        //
        //
        // /**
        //  * todo: socket connected by express.
        //  * legacy device socket. be fill with data.
        //  */
        // socket.on('/legacy', function (data) {
        //     console.log('lagacy data \n');
        //     console.log(data);
        //     if (data.type == "temperature") {
        //         $("#etri-temperature-value").text(data.value + " ℃");
        //     }
        //     if (data.type == "humidity") {
        //         $("#etri-humidity-value").text(data.value + " %");
        //     }
        //     if (data.status == "00") {
        //         $("#etri-window-detect").text("Undetected").css("color", "#23a455");
        //     } else if (data.status == "01") {
        //         $("#etri-window-detect").text("Detected").css("color", "#d72a42");
        //     } else if (data.status == "10") {
        //         $("#etri-human-detect").text("Undetected").css("color", "#23a455");
        //     } else if (data.status == "11") {
        //         $("#etri-human-detect").text("Detected").css("color", "#d72a42");
        //     } else if (data.status == "0") {
        //         $("#etri-gas-alram").text("Undetected").css("color", "#23a455");
        //     } else if (data.status == "1") {
        //         $("#etri-gas-alram").text("Detected").css("color", "#d72a42");
        //     } else if (data.status == "2") {
        //         $("#etri-gas-leackage").text("Gas Blocked").css("color", "#23a455").css("padding-top", "15px");
        //     } else if (data.status == "3") {
        //         $("#etri-gas-leackage").text("Gas None Blocked").css("color", "#d72a42").css("padding-top", "0px");
        //     } else if (data.status == "21" || data.status == "20" || data.status == "22") {
        //         jaesil_data = true;
        //         jaesil_true_false = false;
        //         $("#etri-jaesil-alram").siblings().find("input").attr("checked", true);
        //         $("#etri-jaesil-alram").text("Detected").css("color","#d72a42");
        //     }
        //
        // });
        //
        // var motion_data;
        // var jaesil_data;
        //
        // //todo : reporting data.  check model, status!
        // socket.on('/xiaomi/report', function (data) {
        //     console.log(data);
        //     if (data.model == "magnet") {
        //         $("#xiaomi-window-detect").text(data.data.status);
        //     } else if (data.model == "switch") {
        //         $("#xiaomi-switch-state").text(data.data.status);
        //     } else if (data.model == "plug") {
        //         if (data.data.status == "on") {
        //             $("#xiaomi-plug-state").siblings().find("input").attr("checked", true);
        //             $("#xiaomi-plug-state").text("ON");
        //         } else if (data.data.status == "off") {
        //             $("#xiaomi-plug-state").siblings().find("input").attr("checked", false);
        //             $("#xiaomi-plug-state").text("OFF");
        //         }
        //     } else if (data.model == "motion") {
        //         true_false = false;
        //         motion_data = data.model;
        //         $("#xiaomi-human-detect").text("Detected").css("color","#d72a42");
        //     }
        // });
        //
        // var count = 0;
        // var jaesil_count = 0;
        // var true_false = false;
        // var jaesil_true_false = false;
        //
        // setInterval(function() {
        //     if (motion_data == "motion" && true_false == false) {
        //         count++;
        //         if(count == 30) {
        //             true_false = true;
        //             $("#xiaomi-human-detect").text("Undetected").css("color","#23a455");
        //             count = 0;
        //         }
        //     }
        //     if (jaesil_data == true && jaesil_true_false == false) {
        //         jaesil_count++;
        //         if (jaesil_count == 30) {
        //             jaesil_true_false = true;
        //             $("#etri-jaesil-alram").text("Undetected").css("color","#23a455");
        //             $("#etri-jaesil-alram").siblings().find("input").attr("checked", false);
        //             jaesil_count = 0;
        //         }
        //     }
        // }, 1000);
        //
        // //todo : read data.  check model, status!
        // socket.on('xiaomi/read', function (data) {
        //     console.log(data);
        // });


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
        table.row('.selected').remove().draw(false);
    });

});