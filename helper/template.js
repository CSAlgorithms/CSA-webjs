const _ = require('lodash');

function render(req, res, page, title) {

    // Required arguments
    if(_.isUndefined(res) || _.isUndefined(page) || _.isUndefined(title) || _.isUndefined(req)) {
        throw new Error("Render call is missing required arguments");
    }

    // Adjust data object
    req.data.main_page = page;
    req.data.main_title = title;

    // Render file
    res.render('index', req.data);
}

function show404(req, res, title) {

    // Required arguments
    if(_.isUndefined(res) || _.isUndefined(title) || _.isUndefined(req)) {
        throw new Error("show404 call is missing required arguments");
    }

    // Configure 404
    res.status(404);
    req.data.message = title;
    req.data.error = {status: 404};
    render(req, res, 'error', title);
}

module.exports.render = render;
module.exports.show404 = show404;
