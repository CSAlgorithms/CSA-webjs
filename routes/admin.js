var express = require('express');
var router = express.Router();
var Global = require('../models/global').Global;
var _ = require('lodash');
var auth = require('../config/auth');
var Question = require('../models/question').Question;
var Event = require('../models/event').Event;
var User = require('../models/user').User;

router.get('/config', auth.admin, function(req, res, next) {
    res.setPath([{name: 'Admin', url: '/admin'},{name: 'Configuration'}]);
    res.templateRender('admin/config', 'Website configuration');
});

router.post('/config', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['webName', 'contactEmail', 'notification', 'submissionType']);
    Global.update({}, body, {upsert: true}).then(function (doc) {
        res.setSuccess('Configuration updated successfully');
        res.redirect('/admin/config');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/admin/config');
    });
});

router.get('/', auth.admin, function(req, res, next) {
    Question.count({}).then(function(questionsCount){
        Event.count({}).then(function(eventsCount){
            User.count({}).then(function(usersCount){
                res.addData('questionsCount', questionsCount);
                res.addData('eventsCount', eventsCount);
                res.addData('usersCount', usersCount);
                res.setPath([{name: 'Admin', url: '/admin'},{name: 'Home'}]);
                res.templateRender('admin/home', 'Admin panel');
            });
        });
    });
});

module.exports = router;
