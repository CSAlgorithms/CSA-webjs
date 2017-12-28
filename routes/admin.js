var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/config', function(req, res, next) {
    var path = [{name: 'Admin', url: '/admin'},{name: 'Configuration'}];
    template.render(res, 'admin/config', 'Website configuration', { _path: path});
});

router.get('/', function(req, res, next) {
    var path = [{name: 'Admin', url: '/admin'},{name: 'Home'}];
    template.render(res, 'admin/home', 'Admin panel', { _path: path});
});

module.exports = router;
