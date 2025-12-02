const express = require('express');
const router = express.Router();
const patients = require('../../models/patients.model');

// @desc Get all patients page
// @route GET /patients
router.get('/', async (req, res) => {
    try {
        const patientsList = await patients.getAllPatients();
        res.render('patients/list', { 
            title: 'Bemorlar',
            activePage: 'patients',
            patients: patientsList 
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Search/filter patients
// @route GET /patients/search
router.get('/search', async (req, res) => {
    try {
        const { kasallik, medical_keyword } = req.query;
        let patientsList = [];

        if (kasallik) {
            patientsList = await patients.getPatientsByKasallik(kasallik);
        } else if (medical_keyword) {
            patientsList = await patients.getPatientsByMedicalHistory(medical_keyword);
        } else {
            patientsList = await patients.getAllPatients();
        }

        res.render('patients/list', { 
            title: 'Bemorlar',
            activePage: 'patients',
            patients: patientsList,
            searchParams: { kasallik, medical_keyword }
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Get add patient page
// @route GET /patients/add
router.get('/add', (req, res) => {
        res.render('patients/form', { 
            title: 'Yangi bemor',
            activePage: 'patients',
            patient: null,
            isEdit: false
        });
});

// @desc Get edit patient page
// @route GET /patients/edit/:id
router.get('/edit/:id', async (req, res) => {
    try {
        const patient = await patients.getPatientById(req.params.id);
        if (!patient) {
            return res.redirect('/patients');
        }
        // Extract contact info
        const contactInfo = patient.contact_info || {};
        res.render('patients/form', { 
            title: 'Bemorni tahrirlash',
            activePage: 'patients',
            patient: {
                ...patient,
                email: contactInfo.email || '',
                phone: contactInfo.phone || '',
                address: contactInfo.address || ''
            },
            isEdit: true
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Create patient (form submission)
// @route POST /patients
router.post('/', async (req, res) => {
    try {
        await patients.createPatient(req.body);
        res.redirect('/patients');
    } catch (error) {
        res.render('patients/form', { 
            title: 'Yangi bemor',
            activePage: 'patients',
            patient: req.body,
            isEdit: false,
            error: error.message
        });
    }
});

// @desc Update patient (form submission)
// @route POST /patients/:id
router.post('/:id', async (req, res) => {
    try {
        await patients.updatePatient(req.params.id, req.body);
        res.redirect('/patients');
    } catch (error) {
        res.render('patients/form', { 
            title: 'Bemorni tahrirlash',
            activePage: 'patients',
            patient: { ...req.body, id: req.params.id },
            isEdit: true,
            error: error.message
        });
    }
});

// @desc Delete patient
// @route GET /patients/delete/:id
router.get('/delete/:id', async (req, res) => {
    try {
        await patients.deletePatient(req.params.id);
        res.redirect('/patients');
    } catch (error) {
        res.redirect('/patients');
    }
});

module.exports = router;

