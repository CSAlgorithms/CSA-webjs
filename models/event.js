const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

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
        required: true
    }
});

EventSchema.plugin(autoIncrement.plugin, {
    model: 'Event',
    field: 'eid',
    startAt: 1,
    incrementBy: 1
});

module.exports.Event = mongoose.model('Event', EventSchema);