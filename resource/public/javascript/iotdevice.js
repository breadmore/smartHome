$(function () {
    $(".switch > input").on("click", function () {
        var id = $(this).parents("div").parents("div").attr("id");
        var id2 = $(this).parents("span").parents("div").attr("id");
        if (id == null) {
            $("#" + id2 + " .toggle > p").toggle();
        } else {
            $("#" + id + " .toggle > p").toggle();
        }
    });

    /**
     * open socket.
     */
    let socket = io.connect('/');
    socket.emit('/socket/devices');
    socket.on('/socket/devices', function(data) {
        console.log(data);
    });


    /**
     * todo: socket connected by express.
     * legacy device socket. be fill with data.
     */
    socket.on('/legacy', function(data) {
       console.log('lagacy data \n');
       console.log(data);
       if ( data.type == "temperature" ) {
           $("#temp001 > #value_1").text(data.value);
       }
       if ( data.type == "humidity") {
           $("#hum001 > #value_1").text(data.value);
       }
       if ( data.status == "00") {
           $("#idw001").text("Undetected").css("color","#23a455");
       } else if ( data.status == "01") {
           $("#idw001").text("Detected").css("color","#d72a42");
       } else if ( data.status == "10") {
           $("#idhs001").text("Undetected").css("color","#23a455");
       } else if ( data.status == "11") {
           $("#idhs001").text("Detected").css("color","#d72a42");
       } else if ( data.status == "2" ) {
           $("#lm001").text("Undetected").css("color","#23a455");
       } else if ( data.status == "3") {
           $("#lm001").text("Detected").css("color","#d72a42");
       } else if ( data.status == "0") {
           $("#gaslc001 > div").text("Gas Blocked").css("color","#23a455").css("padding-top","15px");
       } else if ( data.status == "1") {
           $("#gaslc001 > div").text("Gas None Blocked").css("color","#d72a42").css("padding-top","0px");
       } else if ( data.status == "21" || data.status == "20" || data.status == "22") {
           $("#jaesil001 > .value2").text("Detected");
       }

    });



});