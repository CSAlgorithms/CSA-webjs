const User = require('../models/user').User;

var authenticate = function(req, res, next) {
    req.getCSACookie().then(function(token) {
        if(token._id) {
            User.findOne({_id: token._id}).then(function(user) {
                if(user) {
                    res.addData('me', user);
                }
                next();
            });
        } else {
            next();
        }
    }).catch(function(){
        next();
    });
};

module.exports.authenticate = authenticate;