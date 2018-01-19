var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Submission = require('../models/submission').Submission;
var ManualSubmission = require('../models/submission').ManualSubmission;
var CompareSubmission = require('../models/submission').CompareSubmission;
var DockerSubmission = require('../models/submission').DockerSubmission;
var auth = require('../config/auth');
var Question = require('../models/question').Question;
var constant = require('../config/constants').STATIC;

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
    Submission.find({'accepted': false})
        .populate('user').populate('question').populate('type').then(function(submissions) {
            res.addData('submissions', submissions);
            res.loadScript('dataTable');
            res.templateRender('submission/pending', 'Pending submissions');
    });
});

router.get('/view/:id(\\d+)', auth.admin, function(req, res, next) {
    Submission.findOne({sid: req.params.id}).populate('user').populate('question').populate({
        path: 'type',
        populate: {
            path: 'language'
        }
    }).then(function(submission) {
        if(_.isNull(submission)) {
            res.redirect404('Submission not found');
        } else {
            res.addData('submission', submission);
            if(submission.type instanceof ManualSubmission) {
                res.addData('submissionType', constant.SUBMIT_TYPE_MANUAL);
            } else if(submission.type instanceof CompareSubmission) {
                res.addData('submissionType', constant.SUBMIT_TYPE_COMPARE);
            } else if(submission.type instanceof DockerSubmission) {
                res.addData('submissionType', constant.SUBMIT_TYPE_DOCKER);
            }
            res.loadScript('ace');
            res.templateRender('submission/view', 'View submission');
        }
    });
});

router.get('/json/:id', function(req, res, next) {
    var data = {};
    Submission.find({user: req.params.id}).then(function(submissions){
        if(_.isNull(submissions)) {
            res.json(data);
        } else {
            for(var i=0; i < submissions.length; i++) {
                var key = Math.round(submissions[i].createdAt.getTime() / 1000) + '';
                if(key in data) {
                    data[key] += 1;
                } else {
                    data[key] = 1;
                }
            }
            res.json(data);
        }
    });
});

module.exports = router;
