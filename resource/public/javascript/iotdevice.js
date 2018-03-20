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
    });



});