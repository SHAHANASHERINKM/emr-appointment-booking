const DoctorSchedule = require('../models/doctorSchedule.model');
const Appointment = require('../models/appointment.model');

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

const generateSlots = (startTime, endTime, slotDuration, breakStart, breakEnd) => {
    const slots = [];
    let current = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const breakStartMin = timeToMinutes(breakStart);
    const breakEndMin = timeToMinutes(breakEnd);

    while (current + slotDuration <= end) {
        const slotStart = minutesToTime(current);
        const slotEnd = minutesToTime(current + slotDuration);

        if (current >= breakStartMin && current < breakEndMin) {
            current += slotDuration;
            continue;
        }

        slots.push({ start: slotStart, end: slotEnd });
        current += slotDuration;
    }

    return slots;
};

module.exports = {
    getSlots: async (req, res) => {
        try {
            const { doctorId, date } = req.query;

            if (!doctorId || !date) {
                return res.status(400).json({
                    success: false,
                    message: "doctorId and date are required"
                });
            }

            const schedule = await DoctorSchedule.findOne({ doctor: doctorId });
            if (!schedule) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor schedule not found"
                });
            }

           const dayMap = {
    "Sunday": "Sun", "Monday": "Mon", "Tuesday": "Tue",
    "Wednesday": "Wed", "Thursday": "Thu", "Friday": "Fri", "Saturday": "Sat"
};
const fullDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
const dayName = dayMap[fullDay];

            if (!schedule.workingDays.includes(dayName)) {
                return res.status(200).json({
                    success: true,
                    message: `Doctor is not available on ${dayName}`,
                    data: []
                });
            }

            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot view slots for past dates"
                });
            }

            const slots = generateSlots(
                schedule.startTime,
                schedule.endTime,
                schedule.slotDuration,
                schedule.breakStart,
                schedule.breakEnd
            );

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const bookedAppointments = await Appointment.find({
                doctor: doctorId,
                date: { $gte: startOfDay, $lte: endOfDay },
                status: { $ne: 'cancelled' }
            }).select('slotStart slotEnd status');

            const bookedSlots = bookedAppointments.map(a => a.slotStart);

            const slotsWithStatus = slots.map(slot => ({
                start: slot.start,
                end: slot.end,
                status: bookedSlots.includes(slot.start) ? 'booked' : 'available'
            }));

            return res.status(200).json({
                success: true,
                data: {
                    doctorId,
                    date,
                    slotDuration: schedule.slotDuration,
                    workingHours: {
                        start: schedule.startTime,
                        end: schedule.endTime
                    },
                    slots: slotsWithStatus,
                    summary: {
                        total: slotsWithStatus.length,
                        available: slotsWithStatus.filter(s => s.status === 'available').length,
                        booked: slotsWithStatus.filter(s => s.status === 'booked').length
                    }
                }
            });

        } catch (error) {
            console.error("Get slots error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
};