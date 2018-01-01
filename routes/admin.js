var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var Global = require('../models/global').Global;
var _ = require('lodash');
var log = require('winston');

router.get('/config', function(req, res, next) {
    template.setPath(req, [{name: 'Admin', url: '/admin'},{name: 'Configuration'}]);
    var errors = req.flash('errors');
    var post = req.flash('post');
    var success = req.flash('success');
    if(errors) {
        req.data['errors'] = errors;
    }
    if(post) {
        req.data['post'] = post[0];
    }
    if(success) {
        req.data['success'] = success[0];
    }
    template.render(req, res, 'admin/config', 'Website configuration');
});

router.post('/config', function(req, res, next) {
    var body = _.pick(req.body, ['webName', 'contactEmail', 'notification']);
    var global = new Global(body);
    global.save().then(function (doc) {
        log.info('Web configuration updated');
        req.flash('success', 'Configuration updated successfully');
        res.redirect('/admin/config');
    }).catch(function (reason) {
        var messages = [];
        for(var key in reason.errors) {
            messages.push(reason.errors[key].message);
        }
        req.flash('errors', messages);
        req.flash('post', req.body);
        res.redirect('/admin/config');
    });
});

router.get('/', function(req, res, next) {
    template.setPath(req, [{name: 'Admin', url: '/admin'},{name: 'Home'}]);
    template.render(req, res, 'admin/home', 'Admin panel');
});

module.exports = router;
