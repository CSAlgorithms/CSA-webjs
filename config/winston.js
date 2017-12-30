var winston = require('winston');
var dateFormat = require('dateformat');

var now = new Date();
var nameTime = dateFormat(now, "yyyy-h-MM-ss");
winston.add(winston.transports.File, { filename: nameTime +'.log' });

module.exports = winston;