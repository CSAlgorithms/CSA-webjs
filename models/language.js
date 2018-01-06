const mongoose = require('mongoose');

var LanguageSchema = new mongoose.Schema({
    valueName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    displayName: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports.Language = mongoose.model('Language', LanguageSchema);