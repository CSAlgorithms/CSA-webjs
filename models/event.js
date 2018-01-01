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
    }]
});

EventSchema.plugin(autoIncrement.plugin, {
    model: 'Event',
    field: 'eid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Event = mongoose.model('Event', EventSchema);