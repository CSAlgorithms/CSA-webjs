const mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    qid: {
        type: Number,
        unique: true
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
        required: true
    },
    note: {
        type: String
    }
});

module.exports.Question = mongoose.model('Question', QuestionSchema);