var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var Event = require('../models/event').Event;
var Question = require('../models/question').Question;
var log = require('winston');
var _ = require('lodash');

router.get('/', function(req, res, next) {
    template.setPath(req, [{name: 'Event', url: '/event'},{name: 'List'}]);
    template.loadScript(req, 'dataTable');
    Event.find().then(function (events) {
        req.data.events = events;
        template.render(req, res, 'event/list', 'All events');
    });
});

router.get('/add', function(req, res, next) {
    template.setPath(req, [{name: 'Event', url: '/event'},{name: 'Add'}]);
    var errors = req.flash('errors');
    var post = req.flash('post');
    if(errors) {
        req.data['errors'] = errors;
    }
    if(post) {
        req.data['post'] = post[0];
    }
    template.loadScript(req, 'ckeditor');
    template.loadScript(req, 'datetimepicker');
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
    Event.findOne({eid: req.params.id}).then(function(event){
        if(!_.isNull(event)) {
            template.setPath(req, [{name: 'Event', url: '/event'}, {name: 'Edit'}]);
            template.loadScript(req, 'dataTable');
            template.loadScript(req, 'ckeditor');
            template.loadScript(req, 'datetimepicker');
            req.data.event = event;
            var errors = req.flash('errors');
            var success = req.flash('success');
            if(errors) {
                req.data['errors'] = errors;
            }
            if(success) {
                req.data['success'] = success[0];
            }

            // Load questions
            Question.find().lean().then(function (questions) {

                // For each question check if can add/remove
                for(var i = 0; i < questions.length; i++) {
                    questions[i].isAdd = event.questions.indexOf(questions[i]._id) < 0;
                }
                req.data.questions = questions;
                template.render(req, res, 'event/edit', 'Edit event');
            });
        } else {
            template.show404(req, res, 'Event not found');
        }
    });
});

router.post('/edit/:id(\\d+)', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'description', 'startAt', 'endAt']);
    Event.findOne({eid: req.params.id}).then(function(event){
        if(!_.isNull(event)) {
            event.title = body.title;
            event.description = body.description;
            event.startAt = body.startAt;
            event.endAt = body.endAt;
            event.save().then(function(doc) {
                req.flash('success', 'Event update successfully')
                res.redirect('/event/edit/' + req.params.id);
            }).catch(function (reason) {
                var messages = [];
                for(var key in reason.errors) {
                    messages.push(reason.errors[key].message);
                }
                req.flash('errors', messages);
                res.redirect('/event/edit/' + req.params.id);
            });
        } else {
            res.redirect('/event/edit/' + req.params.id);
        }
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Event.findOne({eid: req.params.id}).then(function (event) {
        if(!_.isNull(event)) {
            template.setPath(req, [{name: 'Event', url: '/event'},{name: 'Date'}, {name: 'View'}]);
            req.data.event = event;
            template.render(req, res, 'event/view', 'View event');
        } else {
            template.show404(req, res, 'Event not found');
        }
    });
});

module.exports = router;
