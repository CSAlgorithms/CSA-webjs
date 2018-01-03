var express = require('express');
var router = express.Router();
var Event = require('../../models/event').Event;
var log = require('winston');
var _ = require('lodash');
var HTTP = require('http-status-codes');

router.post('/add_question', function(req, res, next) {
    var body = _.pick(req.body, ['e_id', 'q_id']);
    Event.findById(body.e_id).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            event.questions.addToSet(body.q_id);
            event.save().then(function () {
                res.json({code: HTTP.OK});
            }).catch(function (reason) {
                log.error('Error assigning question to event: ' + reason);
                res.json({code: HTTP.INTERNAL_SERVER_ERROR});
            });
        }
    });
});

router.post('/remove_question', function(req, res, next) {
    var body = _.pick(req.body, ['e_id', 'q_id']);
    Event.findById(body.e_id).then(function (event) {
        if(_.isNull(event)) {
            res.json({code: HTTP.NOT_FOUND});
        } else {
            var index = event.questions.indexOf(body.q_id);
            if(index < 0) {
                res.json({code: HTTP.BAD_REQUEST});
            } else {
                event.questions.splice(index, 1);
                event.save().then(function () {
                    res.json({code: HTTP.OK});
                }).catch(function (reason) {
                    log.error('Error removing question from event: ' + reason);
                    res.json({code: HTTP.INTERNAL_SERVER_ERROR});
                });
            }
        }
    });
});

module.exports = router;
