const express = require('express');
const router = express.Router();
const { getAllPatients, createPatient, getOnePatient, updatePatient, deletePatient } = require('../controllers/patients.controller');

router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getOnePatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router