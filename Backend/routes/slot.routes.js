const express=require('express');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize=require("../middlewares/authorize");
const slotController=require("../controllers/slot.controller")

router.get('/',authMiddleware,authorize("super_admin","receptionist"),slotController.getSlots);

module.exports=router;