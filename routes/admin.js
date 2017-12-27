var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/', function(req, res, next) {
    var path = [{name: 'Admin', url: '/admin'},{name: 'Home'}];
    template.render(res, 'admin/home', 'Admin panel', { _path: path});
});

module.exports = router;
