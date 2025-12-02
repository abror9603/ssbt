const patients = require('../models/patients.model');

// @desc get all patients
// @route GET /api/v1/patients
// @access Public
const getAllPatients = async (req, res, next) => {
    try {
        const patientAll = await patients.getAllPatients();

        res.status(200).json({data: patientAll, message: 'Patients fetched successfully'});
    } catch (error) {
        // console.error('Error fetching patients:', error);
        res.status(500).json({message: `Internal server error: ${error.message}`});
        next(error);
    }
}

// @desc create a new patient
// @route POST /api/v1/patients
// @access Public
const createPatient = async (req, res, next) => {
    try {
        const patient = await patients.createPatient(req.body);
        res.status(201).json({data: patient, message: 'Patient created successfully'});
    } catch (error) {
        // console.error('Error creating patient:', error);
        res.status(500).json({message: 'Internal server error'});
        next(error);
    }
}

// @desc get a patient by id
// @route GET /api/v1/patients/:id
// @access Public
const getOnePatient = async (req, res, next) => {
    try {
        const patient = await patients.getPatientById(req.params.id)
        res.status(200).json({data: patient, message: 'Patient fetched successfully'})
    } catch (error) {
        // console.error('Error fetching patient:', error);
        res.status(500).json({message: 'Internal server error'});
        next(error);
    }
}

// @desc update a patient
// @route PUT /api/v1/patients/:id
// @access Public
const updatePatient = async (req, res, next) => {
    try {
        const patient = await patients.updatePatient(req.params.id, req.body)
        res.status(200).json({data: patient, message: 'Patient updated successfully'})
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
        next(error);
    }
}

// @desc delete a patient
// @route DELETE /api/v1/patients/:id
// @access Public
const deletePatient = async (req, res, next) => {
    try {
        const patient = await patients.deletePatient(req.params.id)
        res.status(200).json({data: patient, message: 'Patient deleted successfully'})
    } catch (error) {
        res.status(500).json({message: error.message || 'Internal server error'});
        next(error);
    }
}

// ==================== COMPLEX QUERY CONTROLLERS ====================

// @desc Get patients with appointments in date range
// @route GET /api/v1/patients/queries/with-appointments
// @access Public
const getPatientsWithAppointmentsInRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({message: 'startDate va endDate talab qilinadi'});
        }
        const result = await patients.getPatientsWithAppointmentsInDateRange(startDate, endDate);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

// @desc Get patients by kasallik
// @route GET /api/v1/patients/queries/by-kasallik/:kasallik
// @access Public
const getPatientsByKasallik = async (req, res, next) => {
    try {
        const { kasallik } = req.params;
        const result = await patients.getPatientsByKasallik(kasallik);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

// @desc Get patients without appointments in range
// @route GET /api/v1/patients/queries/without-appointments
// @access Public
const getPatientsWithoutAppointments = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({message: 'startDate va endDate talab qilinadi'});
        }
        const result = await patients.getPatientsWithoutAppointmentsInRange(startDate, endDate);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

// @desc Get patients with scheduled appointments
// @route GET /api/v1/patients/queries/scheduled-appointments
// @access Public
const getPatientsWithScheduledAppointments = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({message: 'startDate va endDate talab qilinadi'});
        }
        const result = await patients.getPatientsWithScheduledAppointments(startDate, endDate);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

// @desc Get patients by medical history keyword
// @route GET /api/v1/patients/queries/by-medical-history
// @access Public
const getPatientsByMedicalHistory = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({message: 'keyword talab qilinadi'});
        }
        const result = await patients.getPatientsByMedicalHistory(keyword);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

// @desc Get patients without recent appointments
// @route GET /api/v1/patients/queries/without-recent-appointments
// @access Public
const getPatientsWithoutRecentAppointments = async (req, res, next) => {
    try {
        const months = parseInt(req.query.months) || 6;
        const result = await patients.getPatientsWithoutRecentAppointments(months);
        res.status(200).json({data: result, message: 'Success'});
    } catch (error) {
        res.status(500).json({message: error.message});
        next(error);
    }
};

module.exports = {
    getAllPatients,
    createPatient,
    getOnePatient,
    updatePatient,
    deletePatient,
    // Complex queries
    getPatientsWithAppointmentsInRange,
    getPatientsByKasallik,
    getPatientsWithoutAppointments,
    getPatientsWithScheduledAppointments,
    getPatientsByMedicalHistory,
    getPatientsWithoutRecentAppointments,
}