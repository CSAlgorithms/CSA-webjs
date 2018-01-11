const mongoose = require('mongoose');
const validator = require('validator');
const autoIncrement = require('mongoose-auto-increment');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    uid: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: function (data) {
                if(_.isEmpty(data)) return true;
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
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    score: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.generateToken = function() {
    return {_id: this._id};
};

UserSchema.methods.fullname = function() {
    if(!_.isEmpty(this.firstName) || !_.isEmpty(this.lastName)) {
        return (this.firstName + ' ' + this.lastName).trim();
    }
};

UserSchema.statics.findByCredentials = function(username, password) {
    var User = this;
    return User.findOne({username: username}).then(function(user) {
        if(_.isNull(user)) {
            return Promise.reject();
        }

        return new Promise(function(resolve, reject) {
            bcrypt.compare(password, user.password, function(err, res){
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

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

UserSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.virtual('activities', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

module.exports.User = mongoose.model('User', UserSchema);