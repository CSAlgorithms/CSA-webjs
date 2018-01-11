const constant = require('../config/constants').STATIC;
const _ = require('lodash');
const util = require('util');
const moment = require('moment');

var toHtmlArray = function(activities){
    var messages = [];
    for(var i = 0; i < activities.length; i++) {
        switch (activities[i].action) {
            case constant.ACTIVITY_SUBMIT_QUESTION:
                messages.push(util.format('<b>%s</b> submitted question #%d ' +
                    '<span class="float-right small" title="%s">%s</span>',
                    activities[i].user.username, activities[i].object.qid, activities[i].createdAt,
                    moment(activities[i].createdAt).fromNow()));
                break;
            case constant.ACTIVITY_SOLVED_QUESTION:
                // TODO
                break;
            case constant.ACTIVITY_ADD_QUESTION:
                // TODO
                break;
            case constant.ACTIVITY_ADD_EVENT:
                // TODO
                break;
        }
    }
    return messages;
};

module.exports.toHtmlArray = toHtmlArray;