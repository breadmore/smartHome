$(function () {

    let socket = io.connect('/');

    //////////////FFM
    // var socket = io();

    // document.getElementById('record').onclick = function () {
    //
    //     this.disabled = true;
    //     document.getElementById('stop').disabled = false;
    //     socket.emit('record', "sasdasd");
    //     console.log("record start");
    // }
    //
    // socket.on('recodr2',function (data) {
    //     console.log(data);
    // })


    $("#record").click(() => {
        console.log("record");
        socket.emit('record', 'gogo');
    });




    socket.on('start', function (cou) {

        var ipcamera = document.getElementById('ipcamera');
        var divSocket,
            div = document.createElement('div');
        var html = '';
        // for (var i = 0; i < cou; i++) {
        // 	html += '<option value="/cam' + i + '">Cam ' + i + '</option>';
        // }
        // html += '</select>';
        html += "<canvas width='640' height='360'>";
        div.innerHTML = html;
        var canvas = div.getElementsByTagName('canvas')[0];
        // select = div.getElementsByTagName('select')[0];
        // select.onchange = function() {
        //
        // };
        /////////
        if (divSocket) {
            divSocket.disconnect();
            document.getElementById('record').disabled = true;
        }
        // console.log(this.value);
        // console.log("asdasdasds");
        divSocket = io(location.origin + '/cam0');
        divSocket.on('data', function (data) {
            // console.log(data);
            // document.getElementById('record').disabled = false;
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
        });

        ///////
        ipcamera.appendChild(div);

        // document.getElementById('stop').onclick = function () {
        //     this.disabled = true;
        //     document.getElementById('record').disabled = false;
        //     console.log("record stop");
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