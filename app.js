var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var log = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var _ = require('lodash');
var template = require('./helper/template');
var flash = require('connect-flash');
var session = require('express-session');

// Load env variables
var dotenv = require('dotenv').config();
if(_.isUndefined(dotenv.parsed)) {
    log.error('Error loading/parsing .env file');
    process.exit(1);
}

// Configure db
require('./config/mongoose');

// Configure logger
require('./config/winston');

// Configure hbs
require('./config/hbs');

// Routes
var index = require('./routes/index');
var user = require('./routes/user');
var event = require('./routes/event');
var question = require('./routes/question');
var admin = require('./routes/admin');

// Express app
var app = express();

// Template included parts
hbs.registerPartials(path.join(__dirname, 'views'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Load website configuration from db
var Global = require('./models/global').Global;

// Load website configuration
app.use(function (req, res, next) {
    req.data = {};
    req.data.g_webName = '{{CSAlgorithms}}';
    Global.findOne().sort({gid: 'desc'}).then(function (global) {
        if(!_.isEmpty(global.webName)) {
            req.data.g_webName = global.webName;
        }
        if(!_.isEmpty(global.contactEmail)) {
            req.data.g_contactEmail = global.contactEmail;
        }
        if(!_.isEmpty(global.notification)) {
            req.data.g_notification = global.notification;
        }
        next();
    }).catch(function (reason) {
        log.info('Global data was not found, using default configuration')
        next();
    });
});

// Register routes
app.use('/', index);
app.use('/user', user);
app.use('/event', event);
app.use('/question', question);
app.use('/admin', admin);

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
  template.render(req, res, 'error', 'Error');
});

module.exports = app;
