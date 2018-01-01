var express = require('express');
var router = express.Router();
var Event = require('../../models/event').Event;
var log = require('winston');
var _ = require('lodash');

router.post('/add_question', function(req, res, next) {
    res.json({hello: 'world'});
});

module.exports = router;
