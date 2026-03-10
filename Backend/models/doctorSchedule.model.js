const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    workingDays: {
        type: [String],
        enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        default: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },
    startTime: {
        type: String,
        default: '09:00'
    },
    endTime: {
        type: String,
        default: '17:00'
    },
    breakStart: {
        type: String,
        default: '13:00'
    },
    breakEnd: {
        type: String,
        default: '14:00'
    },
    slotDuration: {
        type: Number,
        enum: [10, 15, 20, 30, 45, 60],
        default: 15
    }
}, { timestamps: true });

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);