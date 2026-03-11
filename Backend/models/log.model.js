const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    role: {
        type: String,
        default: null
    },
    action: {
        type: String,
        enum: ['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'CREATE', 'UPDATE', 'DELETE', 'VIEW'],
        required: true
    },
    entity: {
        type: String,
        enum: ['auth', 'appointment', 'patient', 'user', 'slot'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);