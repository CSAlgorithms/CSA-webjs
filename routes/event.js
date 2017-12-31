var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var Event = require('../models/event').Event;
var log = require('winston');
var _ = require('lodash');

router.get('/', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'List'}];
    template.render(req, res, 'event/list', 'All events');
});

router.get('/add', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Add'}];
    var errors = req.flash('errors');
    var post = req.flash('post');
    if(errors) {
        req.data['errors'] = errors;
    }
    if(post) {
        req.data['post'] = post[0];
    }
    template.render(req, res, 'event/add', 'Add event');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'description', 'startAt', 'endAt']);
    var event = new Event(body);
    event.save().then(function (doc) {
        log.info('Event ' + doc.eid + ' added');
        res.redirect('/event');
    }).catch(function (reason) {
        var messages = [];
        for(var key in reason.errors) {
            messages.push(reason.errors[key].message);
        }
        req.flash('errors', messages);
        req.flash('post', req.body);
        res.redirect('/event/add');
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Event title'}, {name: 'Edit'}];
    template.render(req, res, 'event/edit', 'Edit event');
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Date'}, {name: 'View'}];
    template.render(req, res, 'event/view', 'View event');
});

module.exports = router;
