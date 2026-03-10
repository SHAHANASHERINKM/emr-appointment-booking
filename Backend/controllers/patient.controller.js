const Patient = require('../models/patient.model');

module.exports = {
    createPatient: async (req, res) => {
        try {
            const { name, mobile, email, dateOfBirth, gender, address, bloodGroup } = req.body;

            if (!name || !mobile) {
                return res.status(400).json({
                    success: false,
                    message: "Name and mobile are required"
                });
            }

            const existingPatient = await Patient.findOne({ mobile });
            if (existingPatient) {
                return res.status(409).json({
                    success: false,
                    message: "Patient with this mobile already exists"
                });
            }

            const patient = await Patient.create({
                name,
                mobile,
                email: email || null,
                dateOfBirth: dateOfBirth || null,
                gender: gender || null,
                address: address || null,
                bloodGroup: bloodGroup || null,
                createdBy: req.user._id
            });

            return res.status(201).json({
                success: true,
                message: "Patient created successfully",
                data: patient
            });

        } catch (error) {
            console.error("Create patient error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

  searchPatient: async (req, res) => {
    try {
        const { q = "" } = req.query;

        const filter = q.trim().length > 0 ? {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { mobile: { $regex: q, $options: 'i' } },
                { patientId: { $regex: q, $options: 'i' } }
            ]
        } : {};

        const patients = await Patient.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });

    } catch (error) {
        console.error("Search patient error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},

    getPatient: async (req, res) => {
        try {
            const patient = await Patient.findById(req.params.id);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: patient
            });

        } catch (error) {
            console.error("Get patient error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },

    updatePatient: async (req, res) => {
        try {
            const patient = await Patient.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Patient updated successfully",
                data: patient
            });

        } catch (error) {
            console.error("Update patient error:", error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    },
    getPatientCount: async (req, res) => {
    try {
        const count = await Patient.countDocuments();
        return res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
};