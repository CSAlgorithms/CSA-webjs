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
        default: 0
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
    }
});

QuestionSchema.plugin(autoIncrement.plugin, {
    model: 'Question',
    field: 'qid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Question = mongoose.model('Question', QuestionSchema);