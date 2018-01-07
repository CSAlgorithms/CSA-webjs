const mongoose = require('mongoose');

var LanguageSchema = new mongoose.Schema({
    displayName: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports.Language = mongoose.model('Language', LanguageSchema);