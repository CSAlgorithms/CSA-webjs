var express = require('express');
var router = express.Router();
var Global = require('../models/global').Global;
var _ = require('lodash');
var auth = require('../config/auth');

router.get('/config', auth.admin, function(req, res, next) {
    res.setPath([{name: 'Admin', url: '/admin'},{name: 'Configuration'}]);
    res.templateRender('admin/config', 'Website configuration');
});

router.post('/config', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['webName', 'contactEmail', 'notification']);
    Global.update({}, body, {upsert: true}).then(function (doc) {
        res.setSuccess('Configuration updated successfully');
        res.redirect('/admin/config');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/admin/config');
    });
});

router.get('/', auth.admin, function(req, res, next) {
    res.setPath([{name: 'Admin', url: '/admin'},{name: 'Home'}]);
    res.templateRender('admin/home', 'Admin panel');
});

module.exports = router;
