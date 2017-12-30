const mongoose = require('mongoose');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const _ = require('lodash');
// const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    firstName: {
        type: String,
        trim: true,
        required: false,
        validate: {
            validator: validator.isAlphanumeric,
            message: '{VALUE} is not a valid first name'
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: false,
        validate: {
            validator: validator.isAlphanumeric,
            message: '{VALUE} is not a valid last name'
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
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
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        }
    }]
});
