var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/add', function(req, res, next) {
    var path = [{name: 'Question', url: '/question'},{name: 'Add'}];
    template.render(res, 'question/add', 'Add ', { _path: path});
});

module.exports = router;
