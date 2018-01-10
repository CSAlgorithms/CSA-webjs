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
        ref: 'Question',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        ref: 'Language',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
});

var CompareSubmissionSchema = new mongoose.Schema({
    output: {
        type: String,
        required: true
    }
});

var DockerSubmissionSchema = new mongoose.Schema({
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

SubmissionSchema.plugin(autoIncrement.plugin, {
    model: 'Submission',
    field: 'sid',
    startAt: 1,
    incrementBy: 1
});

SubmissionSchema.methods.saveManual = function(submissionType) {
    var submission = this;
    return new Promise(function(resolve, reject) {
        submissionType.save().then(function(){
            submission.typeName = 'ManualSubmission';
            submission.type = submissionType;
            submission.save().then(function(doc) {
                resolve(doc);
            }).catch(function(reason) {
                reject(reason);
            });
        }).catch(function(reason) {
            reject(reason);
        });
    });
};

module.exports.Submission = mongoose.model('Submission', SubmissionSchema);
module.exports.ManualSubmission = mongoose.model('ManualSubmission', ManualSubmissionSchema);
module.exports.CompareSubmission = mongoose.model('CompareSubmission', CompareSubmissionSchema);
module.exports.DockerSubmission = mongoose.model('DockerSubmission', DockerSubmissionSchema);
