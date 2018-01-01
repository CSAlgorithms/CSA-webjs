var express = require('express');
var router = express.Router();
var template = require('../helper/template');
var User = require('../models/user').User;
var _ = require('lodash');
var log = require('winston');

router.get('/', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'List'}];
    template.loadScript(req, 'dataTable');
    User.find({}).then(function(users) {
        req.data.users = users;
        template.render(req, res, 'user/list', 'All users');
    });
});

router.get('/guest', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'New guest'}];
    template.render(req, res, 'user/guest', 'Create a guest user');
});

router.get('/leaderboard', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'Leaderboard'}];
    template.loadScript(req, 'dataTable');
    template.render(req, res, 'user/leaderboard', 'Leaderboard');
});

router.get('/reset', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'Forgot password'}];
    template.render(req, res, 'user/reset', 'Forgot password');
});

router.get('/login', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'Login'}];
    template.render(req, res, 'user/login', 'Login');
});

router.get('/register', function(req, res, next) {
    req.data['_path'] = [{name: 'User'},{name: 'Register'}];
    var errors = req.flash('errors');
    var post = req.flash('post');
    if(errors) {
        req.data['errors'] = errors;
    }
    if(post) {
        req.data['post'] = post[0];
    }
    template.render(req, res, 'user/register', 'Register');
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
    User.findOne({uid: req.params.id}).then(function (user) {
        if(!_.isNull(user)) {
            req.data['user'] = user;
            req.data['_path'] = [{name: 'User'}, {name: user.username}];
            if(!_.isEmpty(user.firstName) || !_.isEmpty(user.lastName)) {
                req.data.user.fullname = (user.firstName + ' ' + user.lastName).trim();
            }
            template.loadScript(req, 'heatMap');
            template.render(req, res, 'user/profile', 'My Profile');
        } else {
            template.show404(req, res, 'Profile not found')
        }
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    req.data['_path'] = [{name: 'User'}, {name: 'Profile'},{name: 'Edit'}];
    template.render(req, res, 'user/edit', 'Edit profile');
});

module.exports = router;
