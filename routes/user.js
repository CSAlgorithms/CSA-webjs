var express = require('express');
var router = express.Router();
var template = require('../helper/template');

router.get('/', function(req, res, next) {
    var path = [{name: 'User'},{name: 'List'}];
    template.render(res, 'user/list', 'All users', { _path: path});
});

router.get('/guest', function(req, res, next) {
    var path = [{name: 'User'},{name: 'New guest'}];
    template.render(res, 'user/guest', 'Create a guest user', { _path: path});
});

router.get('/leaderboard', function(req, res, next) {
    var path = [{name: 'User'},{name: 'Leaderboard'}];
    template.render(res, 'user/leaderboard', 'Leaderboard', { _path: path});
});

router.get('/reset', function(req, res, next) {
    var path = [{name: 'User'},{name: 'Forgot password'}];
    template.render(res, 'user/reset', 'Forgot password', { _path: path});
});

router.get('/login', function(req, res, next) {
    var path = [{name: 'User'},{name: 'Login'}];
    template.render(res, 'user/login', 'Login', { _path: path});
});

router.get('/register', function(req, res, next) {
    var path = [{name: 'User'},{name: 'Register'}];
    template.render(res, 'user/register', 'Register', { _path: path});
});

router.get('/profile/:id(\\d+)', function(req, res, next) {
    var path = [{name: 'User'},{name: 'My Profile'}];
    template.render(res, 'user/profile', 'My Profile', { _path: path});
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    var path = [{name: 'User'}, {name: 'Profile'},{name: 'Edit'}];
    template.render(res, 'user/edit', 'Edit profile', { _path: path});
});

module.exports = router;
