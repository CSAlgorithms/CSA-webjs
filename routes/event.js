var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'List'}];
    template.render(req, res, 'event/list', 'All events');
});

router.get('/add', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Add'}];
    template.render(req, res, 'event/add', 'Add event');
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Event title'}, {name: 'Edit'}];
    template.render(req, res, 'event/edit', 'Edit event');
});

router.get('/view/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'Event', url: '/event'},{name: 'Date'}, {name: 'View'}];
    template.render(req, res, 'event/view', 'View event');
});

module.exports = router;
