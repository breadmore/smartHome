/**
 * Created by Andrew D.Laptev<a.d.laptev@gmail.com> on 30.03.15.
 */

const spawn = require('child_process').spawn
    , EventEmitter = require('events').EventEmitter
    , util = require('util')
;

var moment = require('moment');
/**
 * Stream constructor
 * @param {object} options
 * @param {string} options.input Stream uri, for example rtsp://r3---sn-5hn7su76.c.youtube.com/CiILENy73wIaGQnup-1SztVOYBMYESARFEgGUgZ2aWRlb3MM/0/0/0/video.3gp
 * @param {number|string} [options.rate] Framerate
 * @param {string} [options.resolution] Resolution in WxH format
 * @param {string|number} [options.quality] JPEG quality
 * @param {Array<string>} [options.arguments] Custom arguments for ffmpeg
 * @constructor
 */
var FFMpeg = function (options) {
    if (options.input) {
        this.input = options.input;
    } else {
        throw new Error('no `input` parameter');
    }
    this.rate = options.rate || 10;
    this.resolution = options.resolution;
    this.quality = (options.quality === undefined || options.quality === "") ? 3 : options.quality;
    this.arguments = options.arguments || [];

    this.on('newListener', newListener.bind(this));
    this.on('removeListener', removeListener.bind(this));
    if (Object.observe && (typeof Proxy !== 'function')) {
        Object.observe(this, observer.bind(this));
    }
};
util.inherits(FFMpeg, EventEmitter);

/**
 * FFMpeg command name
 * @type {string}
 */
FFMpeg.cmd = 'ffmpeg';

function newListener(event) {
    if (event === 'data' && this.listeners(event).length === 0) {
        this.start();
    }

    // if (event === 'record' && this.listener(event).length() === 0 ){
    //     this.record();
    // }
}

function removeListener(event) {
    if (event === 'data' && this.listeners(event).length === 0) {
        this.stop();
        console.log('remove Listener');
    }
}

function observer(changes) {
    if (changes.some(function (change) {
            return change.type === 'update';
        })) {
        this.restart();
    }
}

//
// FFMpeg.prototype._args = function() {
//     //영상 출력
//     //ffmpeg -i rtsp:/211.238.240.86:554/unicast -r 10 -q:v 10 -f image2 -udatefirst 1 -
//     console.log("none");
//     return this.arguments.concat(
//         [
//             '-loglevel', 'quiet'
//             , '-i', this.input
//             , '-r', this.rate.toString()]
//         , this.quality ? ['-q:v', this.quality.toString()] : [],
//         [
//             '-vf', 'scale=600:400',
//             //  '-b:v', '512k',
//             '-f', 'image2'
//             , '-updatefirst', '1'
//             , '-'
//         ],
//         [
//         '-loglevel', 'quiet', '-y'
//         , '-i', this.input,
//         '-ss', '0',
//         '-vframes', '1', 'C:/Users/classact/bbh/dev/webstorm/hhha/IoT_Security_Interface/resource/public/image/thumbnail.png'
//     ]);
// };

FFMpeg.prototype._args = function (option,data) {
    //영상 출력 // 썸네일
    // var now = moment(Date.now()).format('YYYYMMDDHHmmss');
    var recordFilePath = './resource/public/video/' + data + '.mp4';
    var thumbnailPath = './resource/public/image/thumbnail.png';

    if (option === 0) {
        return this.arguments.concat([
            '-loglevel', 'quiet', '-y'
            , '-i', this.input,
            '-ss', '0',
            '-vframes', '1', thumbnailPath
        ]);
    }
    else if (option === 1) {
        return this.arguments.concat([
                '-loglevel', 'quiet', '-y'
                , '-i', this.input,
                '-ss', '0',
                '-vframes', '1', thumbnailPath
            ],
            [
                '-loglevel', 'quiet'
                , '-i', this.input
                , '-r', this.rate.toString()],
            this.quality ? ['-q:v', this.quality.toString()] : [],
            [
                '-vf', 'scale=' + this.resolution,
                //  '-b:v', '512k',
                '-f', 'image2'
                , '-updatefirst', '1'
                , '-'
            ]);
    }
    else if (option === 2) {
        console.log(option);
        console.log(data);
        return this.arguments.concat(
            ['-loglevel', 'quiet', '-y', '-i',
                this.input, '-vcodec', 'copy', '-ss', '0',
                '-t', '10', recordFilePath]);
    }

    // var thumbnail = [
    //     '-loglevel', 'quiet', '-y'
    //     , '-i', this.input,
    //     '-ss', '0',
    //     '-vframes', '1', thumbnailPath
    // ];
    //
    //
    // var video1 = [
    //     '-loglevel', 'quiet'
    //     , '-i', this.input
    //     , '-r', this.rate.toString()];
    //
    // var video2 = this.quality ? ['-q:v', this.quality.toString()] : [];
    //
    // var video3 = [
    //     '-vf', 'scale=' + this.resolution,
    //     //  '-b:v', '512k',
    //     '-f', 'image2'
    //     , '-updatefirst', '1'
    //     , '-'
    // ];
    //
    // var stream = this.arguments.concat(thumbnail, video1, video2, video3);
    // var record = this.arguments.concat(['-loglevel', 'debug', '-y', '-i',
    //     this.input, '-vcodec', 'copy', '-ss', '0', '-t', '10', recordFilePath]);
    //
    // var data;
    //
    // if (option == 0) {
    //     data = stream;
    //     on_off_record = false;
    // } else if (option == 1) {
    //     data = record;
    //     on_off_record = true;
    // }
    // return data;
};

FFMpeg.prototype.init = function() {
    this.child = spawn(FFMpeg.cmd, this._args(parseInt(0)));
    this.child.stdout.on('data', this.emit.bind(this, 'data'));
    this.child.stderr.on('data', function (data) {
        // console.log('error');
        // console.log(data);
        // throw new Error(data);
    });
};

FFMpeg.prototype.start = function () {
    this.child = spawn(FFMpeg.cmd, this._args(parseInt(1)));
    this.child.stdout.on('data', this.emit.bind(this, 'data'));
    this.child.stderr.on('data', function (data) {
        // console.log('error ');
        // throw new Error(data);
    });

    // this.on('record', function (record_num) {
    //
    //     this.child = spawn(FFMpeg.cmd, this._args(parseInt(record_num)));
    //     console.log("녹화시작?" + record_num);
    // });

    this.child.on('close', function (code) {
        if (code === 0) {
            setTimeout(FFMpeg.prototype.start.bind(this), 1000);
        }
    }.bind(this));
    this.emit('start');
};

/**
 * Stop ffmpeg spawn process
 */
FFMpeg.prototype.stop = function () {
    if (this.child) {
        this.child.kill();
        delete this.child;
        this.emit('stop');
    }
};
/**
 * Restart ffmpeg spawn process
 */
FFMpeg.prototype.restart = function () {
    if (this.child) {
        this.stop();
        this.start(0);
    }
};

FFMpeg.prototype.record = function (data) {
    this.child = spawn(FFMpeg.cmd, this._args(parseInt(2),data));
    // console.log(data);
    // this.child.stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });

    this.child.stdout.on('data', function (data) {
        console.log('success');
        // console.log(data.toString());
        this.emit.bind(data, 'data');
    });
    // this.child.stdout.on('data', this.emit.bind(this, 'data'));
    this.child.stderr.on('data', function (data) {
        console.log('error');
        console.log(data.toString());
        // throw new Error(data);
    });

    this.child.on('close', function (code) {
        if (code === 0) {
            setTimeout(FFMpeg.prototype.start.bind(this), 1000);
        }
    }.bind(this));

    this.emit('start');
};

if (typeof Proxy === 'function') {
    FFMpeg = new Proxy(FFMpeg, {
        set: function (target, property) {
            if (property !== 'super_' && target[property] !== undefined) {
                target.restart();
            }
            return true;
        }
    });
}

module.exports.FFMpeg = FFMpeg;