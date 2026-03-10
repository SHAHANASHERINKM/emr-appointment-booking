const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authMiddleware= require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/search',authMiddleware , authorize('super_admin', 'receptionist'), patientController.searchPatient);
router.post('/', authMiddleware, authorize('super_admin', 'receptionist'), patientController.createPatient);
router.get("/count", authMiddleware, authorize("super_admin","receptionist"), patientController.getPatientCount);

router.get('/:id', authMiddleware, patientController.getPatient);
router.put('/:id', authMiddleware, authorize('super_admin', 'receptionist'), patientController.updatePatient);

module.exports = router;