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
        res.status(500).json({message: 'Internal server error'});
        next(error);
    }
}

module.exports = {
    getAllPatients,
    createPatient,
    getOnePatient,
    updatePatient,
    deletePatient
}