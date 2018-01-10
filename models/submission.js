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
    typeName: {
        type: String,
        required: true,
        enum: ['ManualSubmission', 'CompareSubmission', 'DockerSubmission']
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'typeName',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var ManualSubmissionSchema = new mongoose.Schema({
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
});

var CompareSubmissionSchema = new mongoose.Schema({
    output: {
        type: String
    }
});

var DockerSubmissionSchema = new mongoose.Schema({
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },
    code: {
        type: String
    }
});

SubmissionSchema.plugin(autoIncrement.plugin, {
    model: 'Submission',
    field: 'sid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Submission = mongoose.model('Submission', SubmissionSchema);
module.exports.ManualSubmission = mongoose.model('ManualSubmission', ManualSubmissionSchema);
module.exports.CompareSubmission = mongoose.model('CompareSubmission', CompareSubmissionSchema);
module.exports.DockerSubmission = mongoose.model('DockerSubmission', DockerSubmissionSchema);
