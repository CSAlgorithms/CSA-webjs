var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Submission = require('../models/submission').Submission;
var auth = require('../config/auth');

router.get('/question/:id(\\d+)', auth.loggedin, function(req, res, next) {
    var me = res.getData('me');
    Submission.find({user: me._id}).populate('question').then(function(submissions) {
        res.addData('submissions', submissions);
        res.loadScript('dataTable');
        res.templateRender('submission/list', 'My submissions');
    });
});

router.post('/submit/:id(\\d+)', auth.loggedin, function(req, res, next) {
    var me = res.getData('me');
    var constant = res.getData('g_constant');
    var submissionType = res.getData('g_submissionType');
    var pickArray = ['question'];
    if(submissionType === constant.SUBMIT_TYPE_MANUAL) {
        pickArray.push('type.manual.language');
        pickArray.push('type.manual.code');
    } else if(submissionType === constant.SUBMIT_TYPE_COMPARE) {
        pickArray.push('type.compare.output');
    } else if(submissionType === constant.SUBMIT_TYPE_DOCKER) {
        pickArray.push('type.docker.language');
        pickArray.push('type.docker.code');
    } else {
        throw new Error('Unknown submission type');
    }
    var body = _.pick(req.body, pickArray);
    body.user = me._id;
    body.typeName = res.getData('g_submissionType');
    var submission = new Submission(body);
    submission.save().then(function(doc) {
        res.setSuccess('Submission completed successfully');
        res.redirect('/question/view/' + req.params.id);
    }).catch(function(reason) {
        res.setReason(reason);
        res.redirectPost('/question/view/' + req.params.id);
    });
});

router.get('/pending', auth.admin, function(req, res, next) {
    var me = res.getData('me');
    Submission.find({'type.manual.approved': false}).populate('user').populate('question').then(function(submissions) {
        res.addData('submissions', submissions);
        res.loadScript('dataTable');
        res.templateRender('submission/pending', 'Pending submissions');
    });
});

module.exports = router;
