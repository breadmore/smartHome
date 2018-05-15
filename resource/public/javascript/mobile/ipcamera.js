var camSocket;
var videoToggle = false;
window.onbeforeunload = function () {
    if (camSocket) {
        console.log('disconnect cam');

        camSocket.disconnect();
        camSocket = undefined;

        console.log('close modal');
        camSocket.emit('stop');
    }
};

$(function () {

    let socket = io.connect('/');

    videoPlayer();

    camSocket = io(location.origin + '/cam0');
    camSocket.emit('stop');
    camSocket.emit('init');
    display(true);
    modal_list();

    ///페이지 열때

    camSocket.emit('stop');
    var ipcamera = document.getElementById('ipcamera');
    var canvas = ipcamera.getElementsByTagName('canvas')[0];
    camSocket.emit('start');
    camSocket.on('data', function (data) {
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
        // img.src = 'data:image/jpeg;base64,' + base64ArrayBuffer(bytes);
    });

    $('.go-back').on('click', function (e) {
        camSocket.emit('stop');
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    });


    // function base64ArrayBuffer(arrayBuffer) {
    //     var base64 = '';
    //     var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    //     var bytes = new Uint8Array(arrayBuffer);
    //     var byteLength = bytes.byteLength;
    //     var byteRemainder = byteLength % 3;
    //     var mainLength = byteLength - byteRemainder;
    //     var a, b, c, d;
    //     var chunk;
    //     // Main loop deals with bytes in chunks of 3
    //     for (var i = 0; i < mainLength; i = i + 3) {
    //         // Combine the three bytes into a single integer
    //         chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    //         // Use bitmasks to extract 6-bit segments from the triplet
    //         a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    //         b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    //         c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    //         d = chunk & 63;               // 63       = 2^6 - 1
    //         // Convert the raw binary segments to the appropriate ASCII encoding
    //         base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    //     }
    //     // Deal with the remaining bytes and padding
    //     if (byteRemainder == 1) {
    //         chunk = bytes[mainLength];
    //         a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
    //         // Set the 4 least significant bits to zero
    //         b = (chunk & 3) << 4; // 3   = 2^2 - 1
    //         base64 += encodings[a] + encodings[b] + '==';
    //     } else if (byteRemainder == 2) {
    //         chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    //         a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    //         b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
    //         // Set the 2 least significant bits to zero
    //         c = (chunk & 15) << 2; // 15    = 2^4 - 1
    //         base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    //     }
    //     return base64;
    // }


});

function display(isCan) {
    if(isCan === true && $("canvas").css("display") === "none") {           //streaming
        $("canvas").toggle();
        $("#ipcamera").toggle();
        $("video").toggle();
        $(".on-air").text("ON AIR");
    }
    else if(isCan === false && $("canvas").css("display") !== "none") {     //videoplay
        $("canvas").toggle();
        $("#ipcamera").toggle();
        $("video").toggle();
    }
}

function videoPlayer() {
    var video = document.getElementById('myVideo');
    var src = document.getElementById('vid');
    var btns = document.getElementsByClassName("myBtn");
    var change = document.getElementById('change');


    $(document).on('click', '.myBtn', function () {
        src.src = "/video/" + $(this).attr('data-name');
        display(false);
        $('.on-air').text($(this).attr('data-name'));

        video.load();

    });

    $(document).on('click', '.video-btn', function () {
        var parent = this.parentElement;
        $('.video-btn-active').removeClass('video-btn-active');
        $('.video-list-active').removeClass('video-list-active');
        $(this).addClass('video-btn-active');
        $(parent).addClass('video-list-active');

        video.load();

    });

    $(document).ready(function () {
        change.onclick = function () {
            display(true);
            video.pause();
        };
    });
}

function modal_list() {
    // $(".video-list").remove();

    $.ajax({
        type:"get",
        url:"/api/videos",
        success: function (data) {
            for(i=0; i<data.length; i++) {
                $(".my-video-list").append("<li class='video-list'>"+"" +
                    "<button class='myBtn video-btn' data-name=\'"+data[i]+"\'>"+
                    data[i]+
                    "</button>" +
                    "</li>" +
                    "<hr class='list-hr'>");
            }
        }
    })
}