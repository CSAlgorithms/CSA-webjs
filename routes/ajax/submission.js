var express = require('express');
var router = express.Router();
var _ = require('lodash');
var HTTP = require('http-status-codes');
var auth = require('../../config/auth');
var ManualSubmission = require('../../models/submission').ManualSubmission;
var constant = require('../../config/constants').STATIC;

router.post('/accept', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['s_id', 'type']);
    var TypeSubmission;
    if(body.type === constant.SUBMIT_TYPE_MANUAL) {
        TypeSubmission = ManualSubmission;
    } else if(body.type === constant.SUBMIT_TYPE_COMPARE) {
        // TODO
    } else if(body.type === constant.SUBMIT_TYPE_DOCKER) {
        // TODO
    } else {
        res.json({code: HTTP.BAD_REQUEST});
    }

    TypeSubmission.findOneAndUpdate({_id: body.s_id}, {approved: true}).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

router.post('/reject', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['s_id', 'type']);
    var TypeSubmission;
    if(body.type === constant.SUBMIT_TYPE_MANUAL) {
        TypeSubmission = ManualSubmission;
    } else if(body.type === constant.SUBMIT_TYPE_COMPARE) {
        // TODO
    } else if(body.type === constant.SUBMIT_TYPE_DOCKER) {
        // TODO
    } else {
        res.json({code: HTTP.BAD_REQUEST});
    }

    TypeSubmission.findOneAndUpdate({_id: body.s_id}, {approved: false}).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

module.exports = router;
