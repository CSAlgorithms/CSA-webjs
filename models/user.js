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
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function() {
    var access = 'auth';
    var token = jwt.sign({_id: this._id, access: access}, process.env.JWT_SECRET).toString();
    this.tokens.push({access: access, token: token});
    return this.save().then(function(){
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    return this.update({
        $pull: {
            tokens: {token: token}
        }
    })
};

UserSchema.methods.findByToken = function(token) {
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
    } catch (e) {
        return Promise.reject();
    }
};

UserSchema.methods.findByCredentials = function(username, password) {

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

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(15, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

module.exports.User = mongoose.model('User', UserSchema);