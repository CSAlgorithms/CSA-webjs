var template = require('../helper/template');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    template.render(res, 'home/home', 'Welcome page');
});

module.exports = router;
