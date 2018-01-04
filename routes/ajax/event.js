var express = require('express');
var router = express.Router();
var Event = require('../../models/event').Event;
var _ = require('lodash');
var HTTP = require('http-status-codes');

router.post('/add_question', function(req, res, next) {
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

router.post('/remove_question', function(req, res, next) {
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

module.exports = router;
