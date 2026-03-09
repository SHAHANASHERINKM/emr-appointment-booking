require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding...");

        await User.deleteMany({});
        console.log("Existing users cleared...");

        await User.create({
            name: "Super Admin",
            email: "admin@emr.com",
            password: "Admin@1234",
            role: "super_admin",
            isActive: true
        });

    
        console.log("Seeding complete!");
        console.log("------------------------------------");
        console.log("Super Admin → admin@emr.com / Admin@1234");
        console.log("------------------------------------");
        console.log("Login as Super Admin and create doctors");
        console.log("and receptionists from the application.");
        console.log("------------------------------------");

        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();