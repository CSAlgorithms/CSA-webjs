const mongoose = require('mongoose');
const constant = require('../config/constants').STATIC;

var ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hidden: {
        type: Boolean,
        default: false
    },
    action: {
        type: String,
        enum: [
            constant.ACTIVITY_ADD_EVENT,
            constant.ACTIVITY_ADD_QUESTION,
            constant.ACTIVITY_SUBMIT_QUESTION,
            constant.ACTIVITY_SOLVED_QUESTION
        ]
    },
    objectType: {
        type: String
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'objectType'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports.Activity = mongoose.model('Activity', ActivitySchema);