var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/add', function(req, res, next) {
    var path = [{name: 'Event', url: '/event'},{name: 'Add'}];
    template.render(res, 'event/add', 'Add event', { _path: path});
});

module.exports = router;
