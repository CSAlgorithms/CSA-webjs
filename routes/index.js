var express = require('express');
var router = express.Router();
var Activity = require('../models/activity').Activity;
var ActivityHelper = require('../helpers/ActivityHelper');
var Question = require('../models/question').Question;

router.get('/', function(req, res, next) {
    Activity.find().sort({createdAt: -1}).limit(20).populate('user').populate('object').then(function(activities) {
        res.addData('activities', ActivityHelper.toHtmlArray(activities));
        res.setPath([{name: "Home"}]);
        res.templateRender('home/home', 'Welcome page');
    });
});

module.exports = router;
