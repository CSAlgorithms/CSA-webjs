var express = require('express');
var router = express.Router();
var Event = require('../../models/event').Event;
var log = require('winston');
var _ = require('lodash');

router.post('/add_question', function(req, res, next) {
    var body = _.pick(req.body, ['e_id', 'q_id']);
    Event.findById(body.e_id).then(function (event) {
        if(_.isNull(event)) {
            // TODO replace numbers with CODES
            res.json({code: 404});
        } else {
            event.questions.addToSet(body.q_id);
            event.save().then(function () {
                res.json({code: 200});
            }).catch(function (reason) {
                log.error('Error assigning question to event: ' + reason);
                res.json({code: 500});
            });
        }
    });
});

module.exports = router;
