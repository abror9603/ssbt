const express = require('express');
const router = express.Router();
const appointments = require('../../models/appointments.model');
const patients = require('../../models/patients.model');

// @desc Get all appointments page
// @route GET /appointments
router.get('/', async (req, res) => {
    try {
        const appointmentsList = await appointments.getAllAppointments();
        res.render('appointments/list', { 
            title: 'Uchrashuvlar',
            activePage: 'appointments',
            appointments: appointmentsList 
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Get add appointment page
// @route GET /appointments/add
router.get('/add', async (req, res) => {
    try {
        const patientsList = await patients.getAllPatients();
        res.render('appointments/form', { 
            title: 'Yangi uchrashuv',
            activePage: 'appointments',
            appointment: null,
            patients: patientsList,
            isEdit: false
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Get edit appointment page
// @route GET /appointments/edit/:id
router.get('/edit/:id', async (req, res) => {
    try {
        const [appointment, patientsList] = await Promise.all([
            appointments.getAppointmentById(req.params.id),
            patients.getAllPatients()
        ]);
        if (!appointment) {
            return res.redirect('/appointments');
        }
        res.render('appointments/form', { 
            title: 'Uchrashuvni tahrirlash',
            activePage: 'appointments',
            appointment: appointment,
            patients: patientsList,
            isEdit: true
        });
    } catch (error) {
        res.render('error', { 
            title: 'Xatolik',
            message: error.message 
        });
    }
});

// @desc Create appointment (form submission)
// @route POST /appointments
router.post('/', async (req, res) => {
    try {
        await appointments.createAppointment(req.body);
        res.redirect('/appointments');
    } catch (error) {
        try {
            const patientsList = await patients.getAllPatients();
            res.render('appointments/form', { 
                title: 'Yangi uchrashuv',
                activePage: 'appointments',
                appointment: req.body,
                patients: patientsList,
                isEdit: false,
                error: error.message
            });
        } catch (err) {
            res.render('error', { 
                title: 'Xatolik',
                message: error.message 
            });
        }
    }
});

// @desc Update appointment (form submission)
// @route POST /appointments/:id
router.post('/:id', async (req, res) => {
    try {
        await appointments.updateAppointment(req.params.id, req.body);
        res.redirect('/appointments');
    } catch (error) {
        try {
            const patientsList = await patients.getAllPatients();
            res.render('appointments/form', { 
                title: 'Uchrashuvni tahrirlash',
                activePage: 'appointments',
                appointment: { ...req.body, id: req.params.id },
                patients: patientsList,
                isEdit: true,
                error: error.message
            });
        } catch (err) {
            res.render('error', { 
                title: 'Xatolik',
                message: error.message 
            });
        }
    }
});

// @desc Delete appointment
// @route GET /appointments/delete/:id
router.get('/delete/:id', async (req, res) => {
    try {
        await appointments.deleteAppointment(req.params.id);
        res.redirect('/appointments');
    } catch (error) {
        res.redirect('/appointments');
    }
});

module.exports = router;

