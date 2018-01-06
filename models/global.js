const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
var autoIncrement = require('mongoose-auto-increment');

var GlobalSchema = new mongoose.Schema({
    gid: {
        type: Number,
        unique: true,
        required: true
    },
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
    },
    submissionType: {
        type: String
    }
});

GlobalSchema.plugin(autoIncrement.plugin, {
    model: 'Global',
    field: 'gid',
    startAt: 1,
    incrementBy: 1
});

GlobalSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

module.exports.Global = mongoose.model('Global', GlobalSchema);