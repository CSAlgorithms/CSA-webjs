const constants = {
    SUBMIT_TYPE_MANUAL: 'manual',
    SUBMIT_TYPE_COMPARE: 'compare',
    SUBMIT_TYPE_DOCKER: 'docker',

    ACTIVITY_SUBMIT_QUESTION: 'submit_question',
    ACTIVITY_ADD_QUESTION: 'add_question',
    ACTIVITY_ADD_EVENT: 'add_event',
    ACTIVITY_SOLVED_QUESTION: 'solved_question'
};

function loadConstants(req, res, next) {
    res.addData('g_constant', constants);
    next();
}

module.exports.loadConstants = loadConstants;
module.exports.STATIC = constants;
