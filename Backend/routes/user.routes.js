const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/user.controller');
const authorise=require("../middlewares/authorize");

const router = express.Router();

router.post('/',authMiddleware,authorise("super_admin"),userController.createUser);
router.get('/',authMiddleware,authorise("super_admin","receptionist"),userController.getUsers);
router.put('/:id',authMiddleware,authorise("super_admin"),userController.updateUser);
router.delete('/:id',authMiddleware,authorise("super_admin"),userController.deleteUser);
router.get('/doctors/:id/schedule', authMiddleware, authorise('super_admin'), userController.getDoctorSchedule);
router.put('/doctors/:id/schedule', authMiddleware, authorise('super_admin'), userController.updateDoctorSchedule);


module.exports = router;