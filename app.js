var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var _ = require('lodash');
var flash = require('connect-flash');
var session = require('express-session');

// Load env variables
var dotenv = require('dotenv').config();
if(_.isUndefined(dotenv.parsed)) {
    console.error('Error loading/parsing .env file');
    process.exit(1);
}

// Configure db
require('./config/mongoose');

// Configure hbs
require('./config/hbs');

// Routes
var index = require('./routes/index');
var user = require('./routes/user');
var event = require('./routes/event');
var question = require('./routes/question');
var submission = require('./routes/submission');
var admin = require('./routes/admin');
var ajaxEvent = require('./routes/ajax/event');

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

// Load website configuration
var routers = require('./config/router');
var auth = require('./config/auth');
app.use(routers.init);
app.use(routers.funcAddData);
app.use(routers.funcGetData);
app.use(routers.funcTemplateRender);
app.use(routers.funcSetPath);
app.use(routers.funcLoadScript);
app.use(routers.funcRedirect404);
app.use(routers.funcSetErrors);
app.use(routers.funcSetReason);
app.use(routers.funcSetSuccess);
app.use(routers.funcRedirectPost);
app.use(routers.funcCookie)
app.use(routers.global);
app.use(auth.authenticate);

// Register routes
app.use('/', index);
app.use('/user', user);
app.use('/event', event);
app.use('/question', question);
app.use('/submission', submission);
app.use('/admin', admin);
app.use('/ajax/event', ajaxEvent);

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
  res.templateRender('error', 'Error');
});

module.exports = app;
