var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var Question = require('../models/question').Question;
var log = require('winston');
var _ = require('lodash');

router.get('/', function(req, res, next) {
    req.data['_path'] = [{name: 'Question', url: '/question'},{name: 'List'}];
    Question.find({}).then(function (questions) {
        req.data['questions'] = questions;
        template.render(req, res, 'question/list', 'All questions');
    });
});

router.get('/add', function(req, res, next) {
    req.data['_path'] = [{name: 'Question', url: '/question'},{name: 'Add'}];
    var errors = req.flash('errors');
    var post = req.flash('post');
    if(errors) {
        req.data['errors'] = errors;
    }
    if(post) {
        req.data['post'] = post[0];
    }
    template.render(req, res, 'question/add', 'Add question');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'score', 'description', 'outputPath', 'note']);
    var question = new Question(body);
    question.save().then(function (doc) {
        log.info('Question ' + doc.qid + ' added');
        res.redirect('/question');
    }).catch(function (reason) {
        var messages = [];
        for(var key in reason.errors) {
            messages.push(reason.errors[key].message);
        }
        req.flash('errors', messages);
        req.flash('post', req.body);
        res.redirect('/question/add');
    });
})

router.get('/edit/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Question', url: '/question'},{name: 'Question'}, {name: 'Edit'}];
    template.render(req, res, 'question/edit', 'Edit question');
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Question', url: '/question'},{name: 'Question'}, {name: 'View'}];
    template.render(req, res, 'question/view', 'View question');
});

module.exports = router;
