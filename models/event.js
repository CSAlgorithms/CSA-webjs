const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var _ = require('lodash');

var EventSchema = new mongoose.Schema({
    eid: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true,
        validate: {
            validator: function (data) {
                if(_.isUndefined(this.startAt) || !_.isDate(this.startAt)) {
                    return true;
                }
                var startAt = new Date(this.startAt);
                var endAt = new Date(this.endAt);
                return startAt.getTime() <= endAt.getTime();
            },
            message: 'End date cannot be before start date'
        }
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

EventSchema.plugin(autoIncrement.plugin, {
    model: 'Event',
    field: 'eid',
    startAt: 1,
    incrementBy: 1
});

EventSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

EventSchema.methods.isMember = function(user) {
    var event = this;
    return new Promise(function(resolve, reject) {
        if(!user || _.isUndefined(user) || _.isNull(user)) {
            resolve(false);
            return;
        }

        for(var i =0; i < event.members.length; i++) {

            // Handle case of populated 'members' attribute
            var _id;
            if(event.members[i] instanceof mongoose.Types.ObjectId) {
                _id = event.members[i];
            } else {
                _id = event.members[i]._id;
            }

            if(user._id.toString() === _id.toString()) {
                resolve(true);
                return;
            }
        }

        resolve(false);
    });
};

module.exports.Event = mongoose.model('Event', EventSchema);