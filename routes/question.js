var express = require('express');
var router = express.Router();
var Question = require('../models/question').Question;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.setPath([{name: 'Question', url: '/question'},{name: 'List'}]);
    res.loadScript('dataTable');
    Question.find({}).then(function (questions) {
        res.addData('questions', questions);
        res.templateRender('question/list', 'All questions');
    });
});

router.get('/add', function(req, res, next) {
    res.setPath([{name: 'Question', url: '/question'},{name: 'Add'}]);
    res.loadScript('ckeditor');
    res.templateRender('question/add', 'Add question');
});

router.post('/add', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'score', 'description', 'outputPath', 'note']);
    var question = new Question(body);
    question.save().then(function (doc) {
        res.setSuccess('Question added successfully');
        res.redirect('/question');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/question/add');
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    Question.findOne({qid: req.params.id}).then(function(question){
        if(!_.isNull(question)) {
            res.setPath([{name: 'Question', url: '/question'},{name: 'Question'}, {name: 'Edit'}]);
            res.loadScript('ckeditor');
            res.addData('question', question);
            res.templateRender('question/edit', 'Edit question');
        } else {
            res.redirect404('Question not found');
        }
    });
});

router.post('/edit/:id(\\d+)', function(req, res, next) {
    var body = _.pick(req.body, ['title', 'score', 'description', 'outputPath', 'removeOutputPath', 'note']);
    // Use "find then update" instead of "find and update" because outputPath is empty by default
    Question.findOne({qid: req.params.id}).then(function(question){
        if(!_.isNull(question)) {
            question.title = body.title;
            question.score = body.score;
            question.description = body.description;
            question.note = body.note;

            // If should remove the old file value
            if(body.removeOutputPath && body.removeOutputPath === question.outputPath) {
                question.outputPath = '';
            }

            // If file replaced
            if(body.outputPath) {
                question.outputPath = body.outputPath;
            }

            question.save().then(function(doc) {
                res.setSuccess('Question updated successfully');
                res.redirect('/question/edit/' + req.params.id);
            }).catch(function (reason) {
                res.setReason(reason);
                res.redirect('/question/edit/' + req.params.id);
            });
        } else {
            res.redirect('/question/edit/' + req.params.id);
        }
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    res.loadScript('ace');
    Question.findOne({qid: req.params.id}).then(function(question) {
        if(!_.isNull(question)) {
            res.setPath([{name: 'Question', url: '/question'}, {name: 'View'}]);
            res.addData('question', question);
            res.templateRender('question/view', 'View question');
        } else {
            res.redirect404('Question not found');
        }
    });
});

module.exports = router;
