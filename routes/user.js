var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'List'}]);
    res.loadScript('dataTable');
    User.find({}).then(function(users) {
        res.addData('users', users);
        res.templateRender('user/list', 'All users');
    });
});

router.get('/guest', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'New guest'}]);
    res.templateRender('user/guest', 'Create a guest user');
});

router.get('/leaderboard', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Leaderboard'}]);
    res.loadScript('dataTable');
    res.templateRender('user/leaderboard', 'Leaderboard');
});

router.get('/reset', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Forgot password'}]);
    res.templateRender('user/reset', 'Forgot password');
});

router.get('/login', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Login'}]);
    res.templateRender('user/login', 'Login');
});

router.get('/register', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Register'}]);
    res.templateRender('user/register', 'Register');
});

router.post('/register', function (req, res) {
    var body = _.pick(req.body, ['email', 'username', 'password', 'firstName', 'lastName']);
    var user = new User(body);
    user.save().then(function (doc) {
        res.redirect('/user/profile/' + doc.uid);
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/user/register');
    });
});

router.get('/profile/:id(\\d+)', function(req, res, next) {
    User.findOne({uid: req.params.id}).then(function (user) {
        if(!_.isNull(user)) {
            res.addData('user', user);
            res.setPath([{name: 'User'}, {name: user.username}]);
            if(!_.isEmpty(user.firstName) || !_.isEmpty(user.lastName)) {
                res.getData('user')['fullname'] = (user.firstName + ' ' + user.lastName).trim();
            }
            res.loadScript('heatMap');
            res.templateRender('user/profile', 'My Profile');
        } else {
            res.redirect404('Profile not found');
        }
    });
});

router.get('/edit/:id(\\d+)', function(req, res, next) {
    res.setPath([{name: 'User'}, {name: 'Profile'},{name: 'Edit'}]);
    res.templateRender('user/edit', 'Edit profile');
});

module.exports = router;
