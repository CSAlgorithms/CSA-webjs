var template = require('../helper/template');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.data['_path'] = [{name: "Home"}];
    template.render(req, res, 'home/home', 'Welcome page');
});

module.exports = router;
