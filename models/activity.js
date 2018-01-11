const mongoose = require('mongoose');

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
        enum: ['add_question', 'submitted_question', '']
    },
    objectType: {
        type: String
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'objectType'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports.Event = mongoose.model('Activity', ActivitySchema);