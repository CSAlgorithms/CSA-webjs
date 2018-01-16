var express = require('express');
var router = express.Router();
var _ = require('lodash');
var HTTP = require('http-status-codes');
var auth = require('../../config/auth');
var Submission = require('../../models/submission').Submission;
var constant = require('../../config/constants').STATIC;

router.post('/accept', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['s_id']);
    Submission.findOneAndUpdate({_id: body.s_id}, {accepted: true}).then(function(submission){
        if(_.isNull(submission)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

router.post('/reject', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['s_id']);
    Submission.findOneAndUpdate({_id: body.s_id}, {accepted: false}).then(function(submission){
        if(_.isNull(submission)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

module.exports = router;
