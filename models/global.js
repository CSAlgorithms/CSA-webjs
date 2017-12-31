const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var GlobalSchema = new mongoose.Schema({
    webName: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true,
        validate: {
            validator: function (data) {
                if(_.isEmpty(data) || _.isUndefined(data)) {
                    return true;
                }
                return validator.isEmail(data);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    notification: {
        type: String,
        trim: true
    }
});

module.exports.Global = mongoose.model('Global', GlobalSchema);