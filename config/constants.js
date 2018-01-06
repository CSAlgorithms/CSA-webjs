const constants = {
    SUBMIT_TYPE_MANUAL: 'manual',
    SUBMIT_TYPE_COMPARE: 'compare',
    SUBMIT_TYPE_DOCKER: 'docker'
};

function loadConstants(req, res, next) {
    res.addData('g_constant', constants);
    next();
}

module.exports.loadConstants = loadConstants;