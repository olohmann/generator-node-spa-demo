var gulp = require('gulp-help')(require('gulp'));
var $ = require('gulp-load-plugins')({ lazy: true });
var slash = require('slash');
var runSequence = require('run-sequence');

// Import custom configuration.
var config = require('./gulpfile.config');

/* --- Serving --- */
gulp.task('serve-dev', 'Serve the dev version of the app and watch for changes.', ['wiredep'], () => {
    var options = config.server.nodemon;
    $.livereload.listen({basePath: config.client.root});
    $.nodemon(options)
        .on('readable', function() {
            this.stdout.on('data', function(chunk) {
                if (/^Listening/.test(chunk)) {
                    gulp.src(config.server.main)
                        .pipe($.livereload())
                        .pipe($.notify('Server changed - reloading app...'));
                }

                process.stdout.write(chunk);
            });
        });

    var clientWatch = $.watch(config.client.all);

    clientWatch.on('change', function(event) {
            gulp.src(config.client.index).pipe($.livereload());
    });
    clientWatch.on('add', function(event) {
        runSequence('wiredep');
    });
    clientWatch.on('unlink', function(event) {
        runSequence('wiredep');
    });

    gulp.src(config.client.index).pipe($.open({uri: `http://localhost:${options.env.PORT}`}));
});

/* --- Dependencies --- */
gulp.task('wiredep', false, function() {
    var wiredep = require('wiredep').stream;
    var options = config.client.wiredep;

    // options.onMainNotFound = (pkg) => {
    //     console.error(`wiredep warning: no main files found in bower: ${pkg}`);
    // };

    return gulp
        .src(config.client.index)
        .pipe(wiredep(options))
        .pipe(inject(config.client.js.src, '', config.client.js.order, config.client.root))
        .pipe(inject(config.client.css.src, '', config.client.css.order, config.client.root))
        .pipe(gulp.dest(config.client.root));
});

/* --- Helpers --- */
/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @param   {String} root The root of the ignorePath.
 * @returns {Stream}   The stream
 */
function inject(src, label, order, root) {
    var options = {
        read: false,
        ignorePath: root || '.',
        relative: true
    };

    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * Log a debug message
 * @param   {Object} msg  The message to log.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
