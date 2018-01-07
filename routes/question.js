var express = require('express');
var router = express.Router();
var Question = require('../models/question').Question;
var _ = require('lodash');
var auth = require('../config/auth');
var Language = require('../models/language').Language;

router.get('/', function(req, res, next) {
    res.setPath([{name: 'Question', url: '/question'},{name: 'List'}]);
    res.loadScript('dataTable');
    Question.find({}).populate('submissions').then(function (questions) {
        res.addData('questions', questions);
        res.templateRender('question/list', 'All questions');
    });
});

router.get('/add', auth.admin, function(req, res, next) {
    res.setPath([{name: 'Question', url: '/question'},{name: 'Add'}]);
    res.loadScript('ckeditor');
    res.templateRender('question/add', 'Add question');
});

router.post('/add', auth.admin, function(req, res, next) {
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

router.get('/edit/:id(\\d+)', auth.admin, function(req, res, next) {
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

router.post('/edit/:id(\\d+)', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['title', 'score', 'description', 'outputPath', 'removeOutputPath', 'note']);
    if(_.isEmpty(body.outputPath) && !body.removeOutputPath) delete body.outputPath;
    delete body.removeOutputPath;
    Question.findOneAndUpdate({qid: req.params.id}, body).then(function(question){
        if(!_.isNull(question)) {
            res.setSuccess('Question updated successfully');
        }
        res.redirect('/question/edit/' + req.params.id);
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirect('/question/edit/' + req.params.id);
    });
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    res.loadScript('ace');
    Question.findOne({qid: req.params.id}).then(function(question) {
        if(!_.isNull(question)) {
            Language.find({}).then(function(languages) {
                res.setPath([{name: 'Question', url: '/question'}, {name: 'View'}]);
                res.addData('question', question);
                res.addData('languages', languages);
                res.templateRender('question/view', 'View question');
            });
        } else {
            res.redirect404('Question not found');
        }
    });
});

module.exports = router;
