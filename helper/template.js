const _ = require('lodash');

function render(res, page, title, data) {

    // Required arguments
    if(_.isUndefined(res) || _.isUndefined(page) || _.isUndefined(title)) {
        throw new Error("Render call is missing required arguments");
    }

    // If data is undefined, then create it
    if(_.isUndefined(data)) {
        data = {};
    }

    // Check if data is an object
    if(!_.isObject(data)) {
        throw new Error('data must be an object');
    }

    // Adjust data object
    data.main_page = page;
    data.main_title = title;

    // Render file
    res.render('index', data);
}

module.exports.render = render;