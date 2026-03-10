const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/apointment.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post('/', authMiddleware, authorize('super_admin', 'receptionist'), appointmentController.createAppointment);
router.get('/', authMiddleware, appointmentController.getAppointments);
router.get('/:id', authMiddleware, appointmentController.getAppointment);
router.put('/:id', authMiddleware, authorize('super_admin', 'receptionist'), appointmentController.updateAppointment);
router.delete('/:id', authMiddleware, authorize('super_admin', 'receptionist'), appointmentController.deleteAppointment);
router.post('/:id/arrive', authMiddleware, authorize('super_admin', 'receptionist'), appointmentController.markArrived);

module.exports = router;