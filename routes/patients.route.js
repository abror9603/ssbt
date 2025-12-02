const express = require('express');
const router = express.Router();
const { 
    getAllPatients, 
    createPatient, 
    getOnePatient, 
    updatePatient, 
    deletePatient,
    getPatientsWithAppointmentsInRange,
    getPatientsByKasallik,
    getPatientsWithoutAppointments,
    getPatientsWithScheduledAppointments,
    getPatientsByMedicalHistory,
    getPatientsWithoutRecentAppointments
} = require('../controllers/patients.controller');

// Basic CRUD routes
router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getOnePatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

// Complex query routes (must be before /:id route)
router.get('/queries/with-appointments', getPatientsWithAppointmentsInRange);
router.get('/queries/by-kasallik/:kasallik', getPatientsByKasallik);
router.get('/queries/without-appointments', getPatientsWithoutAppointments);
router.get('/queries/scheduled-appointments', getPatientsWithScheduledAppointments);
router.get('/queries/by-medical-history', getPatientsByMedicalHistory);
router.get('/queries/without-recent-appointments', getPatientsWithoutRecentAppointments);

module.exports = router