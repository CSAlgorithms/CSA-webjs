const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var QuestionSchema = new mongoose.Schema({
    qid: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    outputPath: {
        type: String,
        required: false
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

QuestionSchema.plugin(autoIncrement.plugin, {
    model: 'Question',
    field: 'qid',
    startAt: 1,
    incrementBy: 1
});

QuestionSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'questions'
});

QuestionSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'question'
});

QuestionSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

module.exports.Question = mongoose.model('Question', QuestionSchema);