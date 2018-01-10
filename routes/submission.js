var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Submission = require('../models/submission').Submission;
var ManualSubmission = require('../models/submission').ManualSubmission;
var auth = require('../config/auth');
var Question = require('../models/question').Question;

router.get('/question/:id(\\d+)', auth.loggedin, function(req, res, next) {
    var me = res.getData('me');
    Submission.find({user: me._id}).populate('question').then(function(submissions) {
        res.addData('submissions', submissions);
        res.loadScript('dataTable');
        res.templateRender('submission/list', 'My submissions');
    });
});

router.post('/submit/:id(\\d+)', auth.loggedin, function(req, res, next) {
    Question.findOne({qid: req.params.id}).then(function(question){
        if(_.isNull(question)) {
            res.redirect('/question/view/' + req.params.id);
        } else {
            var me = res.getData('me');
            var constant = res.getData('g_constant');
            var submissionType = res.getData('g_submissionType');
            var submission = new Submission({user: me._id, question: question._id});

            // Check the type of submission set globally
            if(submissionType === constant.SUBMIT_TYPE_MANUAL) {
                var body = _.pick(req.body, ['language', 'code']);
                submission.saveManual(new ManualSubmission(body)).then(function(doc) {
                    res.setSuccess('Submitted successfully!');
                    res.redirect('/question/view/' + req.params.id);
                }).catch(function(reason) {
                    res.setReason(reason);
                    res.redirect('/question/view/' + req.params.id);
                });
            } else if(submissionType === constant.SUBMIT_TYPE_COMPARE) {
                // TODO
                res.redirect404('Page not found');
            } else if(submissionType === constant.SUBMIT_TYPE_DOCKER) {
                // TODO
                res.redirect404('Page not found');
            } else {
                throw new Error('Unknown submission type');
            }
        }
    });
});

router.get('/pending', auth.admin, function(req, res, next) {
    ManualSubmission.find({'approved': false}).populate({
        path: 'submission',
        populate: [{
            path: 'user'
        },{
            path: 'question'
        }]
    }).then(function(submissions) {
        res.addData('submissions', submissions);
        res.loadScript('dataTable');
        res.templateRender('submission/pending', 'Pending submissions');
    });
});

module.exports = router;
