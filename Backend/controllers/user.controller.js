const User = require("../models/user.model");
const DoctorSchedule = require("../models/doctorSchedule.model");
const createLog = require('../utils/logger');
module.exports={


createUser: async (req, res) => {
    try {
        const { name, email, password, role, specialization, department, phone, schedule } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        if (!['doctor', 'receptionist'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be doctor or receptionist"
            });
        }

        if (role === 'doctor' && !specialization) {
            return res.status(400).json({
                success: false,
                message: "Specialization is required for doctors"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            specialization: specialization || null,
            department: department || null,
            phone: phone || null
        });

        if (role === 'doctor') {
            await DoctorSchedule.create({
                doctor: user._id,
                workingDays: schedule?.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                startTime: schedule?.startTime || '09:00',
                endTime: schedule?.endTime || '17:00',
                breakStart: schedule?.breakStart || '13:00',
                breakEnd: schedule?.breakEnd || '14:00',
                slotDuration: schedule?.slotDuration || 15
            });
        }

        await createLog({
            userId: req.user._id,
            role: req.user.role,
            action: 'CREATE',
            entity: 'user',
            description: `New ${role} created: ${name} (${email})`,
            ipAddress: req.ip
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},

getUsers : async (req, res) => {
    try {
        const { role } = req.query;

        const filter = {
            role: { $ne: 'super_admin' } 
        };
        if (role) filter.role = role;

        const users = await User.find(filter)
            .select('-refreshTokens')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},

 updateUser: async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, specialization, department, phone, isActive } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: "Super admin cannot be updated"
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name: name || user.name,
                email: email || user.email,
                specialization: specialization || user.specialization,
                department: department || user.department,
                phone: phone || user.phone,
                isActive: isActive !== undefined ? isActive : user.isActive
            },
            { new: true, runValidators: true }
        ).select('-refreshTokens');

        await createLog({
            userId: req.user._id,
            role: req.user.role,
            action: 'UPDATE',
            entity: 'user',
            description: `User ${user.name} (${user.role}) updated`,
            ipAddress: req.ip
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},

deleteUser: async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: "Super admin cannot be deactivated"
            });
        }

        user.isActive = false;
        await user.save({ validateBeforeSave: false });

        await createLog({
            userId: req.user._id,
            role: req.user.role,
            action: 'DELETE',
            entity: 'user',
            description: `User ${user.name} (${user.role}) deactivated`,
            ipAddress: req.ip
        });

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},



getDoctorSchedule: async (req, res) => {
    try {
        const schedule = await DoctorSchedule.findOne({ doctor: req.params.id })
            .populate('doctor', 'name specialization department');

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: schedule
        });

    } catch (error) {
        console.error("Get schedule error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
},

updateDoctorSchedule: async (req, res) => {
    try {
        const schedule = await DoctorSchedule.findOneAndUpdate(
            { doctor: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Schedule updated successfully",
            data: schedule
        });

    } catch (error) {
        console.error("Update schedule error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


}