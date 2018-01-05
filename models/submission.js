const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var SubmissionSchema = new mongoose.Schema({
    sid: {
        type: Number,
        unique: true,
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    code: {
        type: String
    }
});

SubmissionSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'submissions'
});

SubmissionSchema.plugin(autoIncrement.plugin, {
    model: 'Submission',
    field: 'sid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Submission = mongoose.model('Submission', SubmissionSchema);