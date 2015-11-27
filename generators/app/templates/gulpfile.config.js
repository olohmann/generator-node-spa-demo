var path = require('path');
var slash = require('slash');

var props = {
    srcClient: './src/client/',
    srcServer: './src/server/',
    srcClientDist: './src/client-dist',
    tmp: './.tmp'
};

function srcClient(glob) {
    return `./${slash(path.join(props.srcClient, glob))}`;
}

function srcServer(glob) {
    return `./${slash(path.join(props.srcServer, glob))}`;
}

function srcTmp(glob) {
    return `./${slash(path.join(props.tmp, glob))}`;
}

var bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '../..'
};

var wiredep = {
    bowerJson: bower.json,
    directory: bower.directory,
    ignorePath: bower.ignorePath
};

var client = {
    root: props.srcClient,
    index: srcClient('index.html'),
    js: {
        src: [
            srcClient('**/*.js'),
            '!' + srcClient('**/*.spec.js'),
        ],
        testSrc: [
            srcClient('**/*.spec.js')
        ],
        order: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        optimized: 'app.js',
        optimizedVendor: 'lib.js'
    },
    css: {
        src: [
            srcClient('**/*.css')
        ],
        order: [
            '*.css'
        ],
        optimized: 'app.css',
        optimizedVendor: 'lib.css'
    },
    all: srcClient('**/*.*'),
    ngTemplatesGlob: srcClient('**/*.template.html'),
    ngTemplatesName: 'templates.js',
    ngTemplatesPath: srcTmp('templates.js'),
    bower: bower,
    wiredep: wiredep,
    srcClientDist: props.srcClientDist
};

var server = {
    root: props.srcClient,
    js: {
        src: [
            srcServer('/**/*.js'),
            '!' + srcServer('/**/*.spec.js'),
        ],
        testSrc: [
            '!' + srcServer('/**/*.spec.js'),
        ],
    },
    main: srcServer('server.js'),
    nodemon: {
        verbose: false,
        ignore: [
            'gulpconfig.js', 'gulpfile.js', 'jsconfig.json',
            './node_modules', './bower_components', srcClient('.')],
        script: srcServer('server.js'),
        ext: 'js, json',
        env: {
            NODE_ENV: 'development',
            PORT: 8080
        },
        nodeArgs: '--debug=5858',
        stdout: true // ensures live-reload.
    }
};

var config = {
    client: client,
    server: server,
    js: {
        src: client.js.src.concat(server.js.src)
    },
    tmp: props.tmp
};

module.exports = config;
