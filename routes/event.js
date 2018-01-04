var express = require('express');
var router = express.Router();
var Event = require('../models/event').Event;
var Question = require('../models/question').Question;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.setPath([{name: 'Event', url: '/event'},{name: 'List'}]);
    res.loadScript('dataTable');
    Event.find().then(function (events) {
        res.addData('events', events);
        res.templateRender('event/list', 'All events');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: 'Event', url: '/event'},{name: 'Add'}]);
    res.loadScript('ckeditor');
    res.loadScript('datetimepicker');
    res.templateRender('event/add', 'Add event');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'description', 'startAt', 'endAt']);
    var event = new Event(body);
    event.save().then(function (doc) {
        res.setSuccess('Event added successfully');
        res.redirect('/event');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/event/add');
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    Event.findOne({eid: req.params.id}).then(function(event){
        if(!_.isNull(event)) {
            res.setPath([{name: 'Event', url: '/event'}, {name: 'Edit'}]);
            res.loadScript('dataTable');
            res.loadScript('ckeditor');
            res.loadScript('datetimepicker');
            res.addData('event', event);

            // Load questions
            Question.find().lean().then(function (questions) {

                // For each question check if can add/remove
                for(var i = 0; i < questions.length; i++) {
                    questions[i].isAdd = event.questions.indexOf(questions[i]._id) < 0;
                }
                res.addData('questions', questions);
                res.templateRender('event/edit', 'Edit event');
            });
        } else {
            res.redirect404('Event not found');
        }
    });
});

router.post('/edit/:id(\\d+)', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'description', 'startAt', 'endAt']);
    Event.findOneAndUpdate({eid: req.params.id}, body).then(function(event){
        if(_.isNull(event)) {
            res.redirect('/event/edit/' + req.params.id);
        } else {
            res.setSuccess('Event updated successfully');
            res.redirect('/event/edit/' + req.params.id);
        }
    }).catch(function(reason){
        res.setReason(reason);
        res.redirect('/event/edit/' + req.params.id);
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    Event.findOne({eid: req.params.id}).populate('questions').then(function (event) {
        if(!_.isNull(event)) {
            res.setPath([{name: 'Event', url: '/event'},{name: 'Date'}, {name: 'View'}]);
            res.addData('event', event);
            res.templateRender('event/view', 'View event');
        } else {
            res.redirect404('Event not found');
        }
    });
});

module.exports = router;
