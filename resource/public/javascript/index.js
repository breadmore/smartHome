$(document).ready(function() {
    console.log("doc ready index.js");
    var socket = io.connect('/');

    console.log(socket);
    socket.emit('/topic/test', "Hello index!!");
    socket.on('/topic/test', function(data) {
        console.log(data);
    })


});