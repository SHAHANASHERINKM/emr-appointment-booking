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
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
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