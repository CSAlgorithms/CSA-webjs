var template = require('../helper/template');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var path = [{name: "Home"}];
    template.render(res, 'home/home', 'Welcome page', { _path: path });
});

module.exports = router;
