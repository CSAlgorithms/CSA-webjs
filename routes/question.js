var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/', function(req, res, next) {
    var path = [{name: 'Question', url: '/question'},{name: 'List'}];
    template.render(res, 'question/list', 'All questions', { _path: path});
});

router.get('/add', function(req, res, next) {
    var path = [{name: 'Question', url: '/question'},{name: 'Add'}];
    template.render(res, 'question/add', 'Add question', { _path: path});
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    var path = [{name: 'Question', url: '/question'},{name: 'Question'}, {name: 'Edit'}];
    template.render(res, 'question/edit', 'Edit question', { _path: path});
});

module.exports = router;
