const express=require("express");
const router=express.Router();

const authRoutes=require("./auth.routes");
const userRoutes=require("./user.routes");
const slotRoutes=require("./slot.routes");
const patientRoutes=require("./patient.routes");
const appointmentRoutes = require('./appointment.routes');



router.use("/auth",authRoutes);
router.use("/users",userRoutes);
router.use("/slots",slotRoutes);
router.use('/patients',patientRoutes);
router.use('/appointments', appointmentRoutes);

module.exports=router