const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    attendees: { type: Number, default: 0 }
});

module.exports = mongoose.model('Event', eventSchema);
