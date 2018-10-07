'use strict';
/**
 * App.js
 *
 * @author      :: Kris Login
 * @module      :: Server
 * @description :: Module dependencies.
 * 
 *
 */

/*
	To support older version of ECMA script and also handle latest features 
	of ECMA 6,7 and 8 bable files are intialized here at the top
*/
require('babel-core/register');
require('babel-polyfill');
require("babel-core").transform("code", {
  presets: ["latest"]
});

/*
	List of required modules used in entire application
*/

// Global intialization of promises
global.Promise = require('bluebird');

// Global initialization of lodash library for array operations 
global.__ = require('lodash');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const engines = require('consolidate');
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
var fs = require('fs');
var rfs = require('rotating-file-stream')
/*var index = require('./routes/index');
var users = require('./routes/users');*/
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// MOrgan logger for logging all the apis on server console durign any service reqquest
app.use(logger(':method :url :response-time ms - :res[content-length] :date[web] :status :remote-addr'));
const logDirectory = path.join(__dirname, 'log')
// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream 
var accessLogStream = rfs('access.log', {
    interval: '5d', // rotate daily 
    path: logDirectory
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '5000mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5000mb',
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
dotenv.load();
app.use(expressValidator());
// all routes settings to allow cross origin with no cache
app.all('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache'); 
    next();
});

/* code to render all route files dynamically */  
fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
    require('./routes/' + file)(app, express, passport);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
