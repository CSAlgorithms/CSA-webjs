const mongoose = require('mongoose');
const validator = require('validator');
const autoIncrement = require('mongoose-auto-increment');

var UserSchema = new mongoose.Schema({
    uid: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (data) {
                return validator.isEmail(data);
            },
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

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'uid',
    startAt: 1,
    incrementBy: 1
});

UserSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'members'
});

UserSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

module.exports.User = mongoose.model('User', UserSchema);