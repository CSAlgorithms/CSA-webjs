const mongoose = require('mongoose');
const validator = require('validator');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    firstName: {
        type: String,
        trim: true,
        required: false
    },
    lastName: {
        type: String,
        trim: true,
        required: false
    },
    username: {
        type: String,
        required: true,
        minlength: 4,
        unique: true,
        validate: {
            validator: validator.isAlphanumeric,
            message: '{VALUE} is not a valid username'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    }
});

module.exports.User = mongoose.model('User', UserSchema);