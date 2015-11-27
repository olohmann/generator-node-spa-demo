/*jshint node:true*/
'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let favicon = require('serve-favicon');
let logger = require('morgan');
let port = process.env.PORT || 8080;
let four0four = require('./utils/404')();

let environment = process.env.NODE_ENV;
app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

let webRoot = './src/client';

// Enable Live-Reload Communication between Browser and Server
if (environment === 'development') {
	let liveReloadPort = 35729;
	console.log(`Livereload on port ${liveReloadPort}.`);
	app.use(require('connect-livereload')({
		port: liveReloadPort
	}));
}

app.use('/api', require('./routes'));

// Just host static files in development. Production will be handled completely different (e.g. nginx).
if (environment === 'development') {
    app.use('/bower_components', express.static('./bower_components'));
}

// Static Web Root
app.use(express.static(webRoot));

// Any invalid calls for templateUrls are under app/* and should return 404
app.use('/app/*', function(req, res, next) {
    four0four.send404(req, res);
});

// Any deep link calls should return index.html
app.use('/*', express.static(`${webRoot}/index.html`));

app.listen(port, function() {
    console.log('Listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});
