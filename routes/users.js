var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/login', function(req, res, next) {
    var path = [{name: 'User', url: '/user'},{name: 'Login'}];
    template.render(res, 'user/login', 'Login', { _path: path});
});

router.get('/register', function(req, res, next) {
    var path = [{name: 'User', url: '/user'},{name: 'Register'}];
    template.render(res, 'user/register', 'Register', { _path: path});
});

module.exports = router;
