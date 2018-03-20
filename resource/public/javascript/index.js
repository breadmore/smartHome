$(document).ready(function() {
    let socket = io.connect('/');

    socket.emit('/topic/test', "Hello index!!");
    socket.on('/topic/test', function(data) {
        console.log(data);
    });

});