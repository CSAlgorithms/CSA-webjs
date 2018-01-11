var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var _ = require('lodash');
var auth = require('../config/auth');
var ActivityHelper = require('../helpers/ActivityHelper');

router.get('/', auth.admin, function(req, res, next) {
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
    User.find({}).sort({'score': -1}).limit(100).then(function(users) {
        res.addData('users', users);
        res.setPath([{name: 'User'},{name: 'Leaderboard'}]);
        res.loadScript('dataTable');
        res.templateRender('user/leaderboard', 'Leaderboard');
    });
});

router.get('/reset', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Forgot password'}]);
    res.templateRender('user/reset', 'Forgot password');
});

router.get('/login', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Login'}]);
    res.templateRender('user/login', 'Login');
});

router.post('/login', function(req, res, next) {
    var body = _.pick(req.body, ['username', 'password']);
    User.findByCredentials(body.username, body.password).then(function(user){
        var token = user.generateToken();
        res.setCSACookie(token);
        res.redirect('/user/profile/' + user.uid);
    }).catch(function() {
        res.setErrors('Incorrect username and/or password');
        res.redirect('/user/login');
    });
});

router.get('/logout', function(req, res, next) {
    res.unsetCSACookie();
    res.redirect('/user/login');
});

router.get('/register', function(req, res, next) {
    res.setPath([{name: 'User'},{name: 'Register'}]);
    res.templateRender('user/register', 'Register');
});

router.post('/register', function (req, res) {
    var body = _.pick(req.body, ['email', 'username', 'password', 'firstName', 'lastName']);
    var user = new User(body);
    user.save().then(function (doc) {
        res.setSuccess('Your account was created successfully');
        res.redirect('/user/login');
    }).catch(function (reason) {
        res.setReason(reason);
        res.redirectPost('/user/register');
    });
});

router.get('/profile/:id(\\d+)', function(req, res, next) {
    User.findOne({uid: req.params.id}).populate({
        path: 'activities',
        options: {
            limit: 10,
            sort: {createdAt: -1}
        },
        populate: [{
            path: 'object'
        },{
            path: 'user'
        }]
    }).then(function (user) {
        if(!_.isNull(user)) {
            res.addData('user', user);
            res.addData('activities', ActivityHelper.toHtmlArray(user.activities));
            res.setPath([{name: 'User'}, {name: user.username}]);
            res.getData('user')['fullname'] = user.fullname();
            res.loadScript('heatMap');
            res.templateRender('user/profile', 'My Profile');
        } else {
            res.redirect404('Profile not found');
        }
    });
});

router.get('/edit/:id(\\d+)', auth.loggedin, function(req, res, next) {

    // Verify user is logged in or user is an admin
    var me = res.getData('me');
    if(!me.admin && me.uid !== parseInt(req.params.id)) {
        res.redirect404('Page not found');
        return;
    }

    User.findOne({uid: req.params.id}).then(function(user){
        if(_.isNull(user)) {
            res.redirect404('User not found');
        } else {
            res.setPath([{name: 'User'}, {name: 'Profile'},{name: 'Edit'}]);
            res.addData('user', user);
            res.templateRender('user/edit', 'Edit profile');
        }
    });
});

router.post('/edit/:id(\\d+)', auth.loggedin, function(req, res, next) {

    // Verify user is logged in or user is an admin
    var me = res.getData('me');
    if(!me.admin && me.uid !== parseInt(req.params.id)) {
        res.redirect404('Page not found');
        return;
    }

    var postArray = ['email', 'password', 'firstName', 'lastName'];
    if(me.admin){
        postArray.push('username');
        postArray.push('admin');
        postArray.push('score');
    }
    var body = _.pick(req.body, postArray);
    if(_.isEmpty(body.password)) delete body.password;

    // Note: Do not replace this by findOneAndUpdate because of the user scheme pre hook
    User.findOne({uid: req.params.id}).then(function(user){
        if(!_.isNull(user)) {
            user = _.extend(user, body);
            user.save().then(function (doc) {
                res.setSuccess('Profile updated successfully');
                res.redirect('/user/edit/' + req.params.id);
            }).catch(function (reason) {
                res.setReason(reason);
                res.redirect('/user/edit/' + req.params.id);
            });
        } else {
            res.redirect('/user/edit/' + req.params.id);
        }
    });
});

router.get('/admin', auth.loggedin, function(req, res, next) {
    User.find({admin: true}).then(function(admins) {
        if(admins.length === 0) {
            User.find({}).then(function(users){
                res.addData('users', users);
                res.templateRender('user/admin', 'Set admin');
            });
        } else {
            res.redirect404('Page not found');
        }
    });
});

router.post('/admin', auth.loggedin, function(req, res, next) {
    User.find({admin: true}).then(function(admins) {
        if(admins.length === 0) {
            var body = _.pick(req.body, ['id']);
            User.findOneAndUpdate({_id: body.id}, {admin: true}).then(function(user) {
                res.redirect('/');
            });
        }
    });
});

module.exports = router;
