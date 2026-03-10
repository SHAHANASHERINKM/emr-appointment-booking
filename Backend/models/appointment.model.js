const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slotStart: {
        type: String,
        required: true
    },
    slotEnd: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'arrived', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    patientType: {
        type: String,
        enum: ['new', 'existing'],
        required: true
    },
    purpose: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    arrivedAt: {
        type: Date,
        default: null
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// prevent double booking
appointmentSchema.index(
    { doctor: 1, date: 1, slotStart: 1 },
    { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);