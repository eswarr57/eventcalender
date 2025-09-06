const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: String,       // Original file name
    serverName: String,         // Unique file name on server
    eventId: String,            // Associated event
    uploadDate: { type: Date, default: Date.now },
    url: String                 // Access URL
});

module.exports = mongoose.model('File', fileSchema);
