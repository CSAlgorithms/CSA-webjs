var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var _ = require('lodash');
var Language = require('../models/language').Language;

router.get('/', auth.admin, function(req, res, next) {
    res.setPath([{name: "Language"}, {name: 'List'}]);
    res.loadScript('dataTable');
    Language.find({}).then(function(languages) {
        res.addData('languages', languages);
        res.templateRender('language/list', 'All languages');
    });
});

router.get('/add', auth.admin, function(req, res, next) {
    res.setPath([{name: "Language", url: "/language"}, {name: 'Add'}]);
    res.templateRender('language/add', 'Add language');
});

router.post('/add', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['displayName']);
    var language = new Language(body);
    language.save().then(function(doc) {
        res.setSuccess('Language added successfully');
        res.redirect('/language');
    }).catch(function(reason) {
        res.setReason(reason);
        res.redirectPost('/language/add');
    });
});

router.get('/edit/:id', auth.admin, function(req, res, next) {
    res.setPath([{name: "Language", url: "/language"}, {name: 'Edit'}]);
    Language.findById(req.params.id).then(function(language) {
        if(_.isNull(language)) {
            res.redirect404('Language not found');
        } else {
            res.addData('language', language);
            res.templateRender('language/edit', 'Edit language');
        }
    });
});

router.post('/edit/:id', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['displayName']);
    Language.findOneAndUpdate({_id: req.params.id}, body).then(function(language) {
        if(_.isNull(language)) {
            res.redirect404('Language not found');
        } else {
            res.setSuccess('Language updated successfully');
            res.redirect('/language');
        }
    });
});

module.exports = router;
