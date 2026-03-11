const Appointment = require('../models/appointment.model');
const Patient = require('../models/patient.model');
const createLog = require('../utils/logger');

module.exports = {
    createAppointment: async (req, res) => {
        try {
            const {
                doctorId,
                date,
                slotStart,
                slotEnd,
                patientType,
                patientId,
                patientName,
                patientMobile,
                purpose,
                notes
            } = req.body;

            if (!doctorId || !date || !slotStart || !slotEnd || !patientType) {
                return res.status(400).json({
                    success: false,
                    message: "doctorId, date, slotStart, slotEnd and patientType are required"
                });
            }

            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot book appointments for past dates"
                });
            }

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const existingAppointment = await Appointment.findOne({
                doctor: doctorId,
                date: { $gte: startOfDay, $lte: endOfDay },
                slotStart,
                status: { $ne: 'cancelled' }
            });

            if (existingAppointment) {
                return res.status(409).json({
                    success: false,
                    message: "This slot is already booked. Please select another slot."
                });
            }

            let patient;

            if (patientType === 'existing') {
                if (!patientId) {
                    return res.status(400).json({
                        success: false,
                        message: "patientId is required for existing patient"
                    });
                }
                patient = await Patient.findOne({ patientId: patientId });
                if (!patient) {
                    return res.status(404).json({
                        success: false,
                        message: "Patient not found"
                    });
                }
            } else if (patientType === 'new') {
                if (!patientName || !patientMobile) {
                    return res.status(400).json({
                        success: false,
                        message: "patientName and patientMobile are required for new patient"
                    });
                }

                const existingPatient = await Patient.findOne({ mobile: patientMobile });
                if (existingPatient) {
                    return res.status(409).json({
                        success: false,
                        message: "Patient with this mobile already exists. Please use existing patient."
                    });
                }

                patient = await Patient.create({
                    name: patientName,
                    mobile: patientMobile,
                    createdBy: req.user._id
                });

            } else {
                return res.status(400).json({
                    success: false,
                    message: "patientType must be new or existing"
                });
            }

            const appointment = await Appointment.create({
                patient: patient._id,
                doctor: doctorId,
                date: selectedDate,
                slotStart,
                slotEnd,
                patientType,
                purpose: purpose || null,
                notes: notes || null,
                bookedBy: req.user._id,
                status: 'scheduled'
            });

            await createLog({
                userId: req.user._id,
                role: req.user.role,
                action: 'CREATE',
                entity: 'appointment',
                description: `Appointment created for patient ${patient.name} on ${date} at ${slotStart}`,
                ipAddress: req.ip
            });

            const populated = await Appointment.findById(appointment._id)
                .populate('patient', 'name mobile patientId')
                .populate('doctor', 'name specialization department')
                .populate('bookedBy', 'name role');

            return res.status(201).json({
                success: true,
                message: "Appointment booked successfully",
                data: populated
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "This slot was just booked by someone else. Please select another slot."
                });
            }
            console.error("Create appointment error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

    getAppointments: async (req, res) => {
        try {
            const { date, doctorId, status, page = 1, limit = 10 } = req.query;

            const filter = {};

            if (req.user.role === 'doctor') {
                filter.doctor = req.user._id;
            } else if (doctorId) {
                filter.doctor = doctorId;
            }

            if (date) {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                filter.date = { $gte: startOfDay, $lte: endOfDay };
            }

            if (status) filter.status = status;

            const skip = (Number(page) - 1) * Number(limit);
            const total = await Appointment.countDocuments(filter);

            const appointments = await Appointment.find(filter)
                .populate('patient', 'name mobile patientId gender')
                .populate('doctor', 'name specialization department')
                .populate('bookedBy', 'name role')
                .sort({ date: 1, slotStart: 1 })
                .skip(skip)
                .limit(Number(limit));

            return res.status(200).json({
                success: true,
                count: appointments.length,
                data: appointments,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    limit: Number(limit)
                }
            });

        } catch (error) {
            console.error("Get appointments error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

    getAppointment: async (req, res) => {
        try {
            const appointment = await Appointment.findById(req.params.id)
                .populate('patient')
                .populate('doctor', 'name specialization department phone')
                .populate('bookedBy', 'name role');

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: appointment
            });

        } catch (error) {
            console.error("Get appointment error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

    updateAppointment: async (req, res) => {
        try {
            const { purpose, notes, status, cancelReason } = req.body;

            const appointment = await Appointment.findById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            if (appointment.status === 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: "Cannot update a cancelled appointment"
                });
            }

            if (purpose) appointment.purpose = purpose;
            if (notes) appointment.notes = notes;
            if (status) {
                appointment.status = status;
                if (status === 'cancelled') {
                    appointment.cancelledAt = new Date();
                    appointment.cancelReason = cancelReason || null;
                }
                if (status === 'arrived') {
                    appointment.arrivedAt = new Date();
                }
            }

            await appointment.save();

            await createLog({
                userId: req.user._id,
                role: req.user.role,
                action: 'UPDATE',
                entity: 'appointment',
                description: `Appointment ${req.params.id} updated${status ? ` - status changed to ${status}` : ''}`,
                ipAddress: req.ip
            });

            return res.status(200).json({
                success: true,
                message: "Appointment updated successfully",
                data: appointment
            });

        } catch (error) {
            console.error("Update appointment error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

    deleteAppointment: async (req, res) => {
        try {
            const appointment = await Appointment.findById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            await Appointment.findByIdAndDelete(req.params.id);

            await createLog({
                userId: req.user._id,
                role: req.user.role,
                action: 'DELETE',
                entity: 'appointment',
                description: `Appointment ${req.params.id} deleted`,
                ipAddress: req.ip
            });

            return res.status(200).json({
                success: true,
                message: "Appointment deleted successfully"
            });

        } catch (error) {
            console.error("Delete appointment error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

   markArrived: async (req, res) => {
        try {
            const appointment = await Appointment.findById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });
            }

            if (appointment.status === 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: "Cannot mark a cancelled appointment as arrived"
                });
            }

            appointment.status = 'arrived';
            appointment.arrivedAt = new Date();
            await appointment.save();

            await createLog({
                userId: req.user._id,
                role: req.user.role,
                action: 'UPDATE',
                entity: 'appointment',
                description: `Patient marked as arrived for appointment ${req.params.id}`,
                ipAddress: req.ip
            });

            return res.status(200).json({
                success: true,
                message: "Patient marked as arrived",
                data: appointment
            });

        } catch (error) {
            console.error("Mark arrived error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
};