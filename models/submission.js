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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    },
    typeName: {
        type: String,
        required: true
    },
    type: {
        manual: {
            language: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Language'
            },
            code: {
                type: String
            },
            approved: {
                type: Boolean,
                default: false
            }
        },
        compare: {
            output: {
                type: String
            }
        },
        docker: {
            language: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Language'
            },
            code: {
                type: String
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

SubmissionSchema.plugin(autoIncrement.plugin, {
    model: 'Submission',
    field: 'sid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Submission = mongoose.model('Submission', SubmissionSchema);