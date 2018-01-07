var express = require('express');
var router = express.Router();
var Event = require('../../models/event').Event;
var _ = require('lodash');
var HTTP = require('http-status-codes');
var auth = require('../../config/auth');

router.post('/add_question', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['e_id', 'q_id']);
    Event.findOneAndUpdate({_id: body.e_id}, {$addToSet: {questions: body.q_id}}).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

router.post('/remove_question', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['e_id', 'q_id']);
    Event.findOneAndUpdate({_id: body.e_id}, {$pull: {questions: body.q_id}}).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

router.post('/join', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['e_id']);
    var me = res.getData('me');
    Event.findOneAndUpdate({_id: body.e_id}, {$addToSet: {members: me._id}}).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            res.json({code: HTTP.OK});
        }
    }).catch(function (reason) {
        res.json({code: HTTP.INTERNAL_SERVER_ERROR});
    });
});

router.post('/leave', auth.admin, function(req, res, next) {
    var body = _.pick(req.body, ['e_id']);
    var me = res.getData('me');
    Event.findOneAndUpdate({_id: body.e_id}, {$pull: {members: me._id}}).then(function (event) {
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
