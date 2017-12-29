var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/', function(req, res, next) {
    var path = [{name: 'Event', url: '/event'},{name: 'List'}];
    template.render(res, 'event/list', 'All events', { _path: path});
});

router.get('/add', function(req, res, next) {
    var path = [{name: 'Event', url: '/event'},{name: 'Add'}];
    template.render(res, 'event/add', 'Add event', { _path: path});
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    var path = [{name: 'Event', url: '/event'},{name: 'Event title'}, {name: 'Edit'}];
    template.render(res, 'event/edit', 'Edit event', { _path: path});
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    var path = [{name: 'Event', url: '/event'},{name: 'Date'}, {name: 'View'}];
    template.render(res, 'event/view', 'View event', { _path: path});
});

module.exports = router;
