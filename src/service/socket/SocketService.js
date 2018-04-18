var socketComponent = require('../../components/SocketComponent');
var stateService = require('../api/v1/StateService');
var app = require('../../server');

const rtsp = require('rtsp-ffmpeg');

//todo : remove test code.
// function testService(socket, url, data) {
//     socketComponent.responseToTargetSocket(socket, url, data);
// }

function legacyStatesService(socket, url) {
    stateService.getLastState(function (err, result) {
        socketComponent.responseToTargetSocket(socket, url, result[0]);
    });
}

const cams = ['rtsp://10.0.254.1:554/unicast'].map(function (uri, i) {
    var stream = new rtsp.FFMpeg({
        rate: 10,
        resolution: '640:440',
        input: uri,
        quality: 20,
    });
    stream.on('start', function () {
        console.log('stream ' + i + ' started');
        // console.log(uri);
        // io.sockets.emit('record', "채팅방에 입장 하셨습니다.");
    });
    stream.on('stop', function () {
        console.log('stream ' + i + ' stopped');
    });

    return stream;
});

var webSocket;

cams.forEach(function (camStream, i) {
    const ns = app.io.of('/cam0');
    ns.on('connection', function (wsocket) {
        webSocket = wsocket;
        console.log('connected to /cam' + i);
        // camStream.emit('record', 0);
        var pipeStream = function (data) {
            wsocket.emit('data', data);
        };
        camStream.on('data', pipeStream);

        wsocket.on('start', function () {
            console.log('start');
            camStream.start();
        });

        wsocket.on('stop', function () {
            console.log('stop');
            camStream.stop();
        });

        wsocket.on('restart', function () {
            console.log('restart');
            camStream.restart();
        });

        wsocket.on('record', function(){
            console.log('record  cam')
            camStream.record();
        });

        wsocket.on('init', function(data){
            console.log('init cam')
            camStream.init();
        });

        wsocket.on('disconnect', function () {
            console.log('disconnected from /cam' + i);
            camStream.removeListener('data', pipeStream);
        });
    });
});

// const ns = app.io.of('/cam0');
function camService(socket, url) {
    socketComponent.responseToTargetSocket(socket, url, cams.length);
}


module.exports = {
    // testService : testService,
    legacyStatesService: legacyStatesService,
    camService: camService
};


// io.on('connection', function(socketio) {
//     console.log('connect!');
//     setTimeout(function(){
//         console.log('emit!start');
//
//         console.log('emit! end');
//     }, 3000);
//
//
//     socketio.on('record', (res) => {
//         cams.forEach(function(camStream) {
//             camStream.emit('record', res);
//         });
//     })
// });
