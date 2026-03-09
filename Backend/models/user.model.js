const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false        // never returned in queries
    },
    role: {
        type: String,
        enum: ['super_admin', 'doctor', 'receptionist'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // doctor only fields
    specialization: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    // array for multiple device sessions
    refreshTokens: [
        {
            token: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);