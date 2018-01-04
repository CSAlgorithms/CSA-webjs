var express = require('express');
var router = express.Router();
var Global = require('../models/global').Global;
var _ = require('lodash');

router.get('/config', function(req, res, next) {
    res.setPath([{name: 'Admin', url: '/admin'},{name: 'Configuration'}]);
    res.templateRender('admin/config', 'Website configuration');
});

router.post('/config', function(req, res, next) {
    var body = _.pick(req.body, ['webName', 'contactEmail', 'notification']);
    var global = new Global(body);
    global.save().then(function (doc) {
        res.setSuccess('Configuration updated successfully');
        res.redirect('/admin/config');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/admin/config');
    });
});

router.get('/', function(req, res, next) {
    res.setPath([{name: 'Admin', url: '/admin'},{name: 'Home'}]);
    res.templateRender('admin/home', 'Admin panel');
});

module.exports = router;
