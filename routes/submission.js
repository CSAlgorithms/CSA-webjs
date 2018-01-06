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
    var body = _.pick(req.body, ['question', 'code']);
    body.user = me._id;
    var submission = new Submission(body);
    submission.save().then(function(doc) {
        res.setSuccess('Submission completed successfully');
        res.redirect('/question/view/' + req.params.id);
    }).catch(function(reason) {
        res.setReason(reason);
        res.redirectPost('/question/view/' + req.params.id);
    });
});

module.exports = router;
