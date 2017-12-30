var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var User = require('../models/user').User;
var _ = require('lodash');
var log = require('winston');

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
    var data = {_path: path};
    var errors = req.flash('errors');
    var post = req.flash('post');
    if(errors) {
        data['errors'] = errors;
    }
    if(post) {
        data['post'] = post[0];
    }
    template.render(res, 'user/register', 'Register', data);
});

router.post('/register', function (req, res) {
    var body = _.pick(req.body, ['email', 'username', 'password', 'firstName', 'lastName']);
    var user = new User(body);
    user.save().then(function (doc) {
        log.info('User ' + user.uid + ' added');
        res.redirect('/user/profile/' + doc.username);
    }).catch(function (reason) {
        var messages = [];
        for(var key in reason.errors) {
            messages.push(reason.errors[key].message);
        }
        req.flash('errors', messages);
        req.flash('post', req.body);
        res.redirect('/user/register');
    });
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
