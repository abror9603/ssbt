const appointments = require("../models/appointments.model");

// @desc get all appointments
// @route GET /api/v1/appointments
// @access Public
const getAllAppointments = async (req, res, next) => {
  try {
    const appointmentsList = await appointments.getAllAppointments();
    res.status(200).json({
      data: appointmentsList,
      message: "Appointments fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
    next(error);
  }
};

// @desc create a new appointment
// @route POST /api/v1/appointments
// @access Public
const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointments.createAppointment(req.body);
    res
      .status(201)
      .json({ data: appointment, message: "Appointment created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// @desc get an appointment by id
// @route GET /api/v1/appointments/:id
// @access Public
const getOneAppointment = async (req, res, next) => {
  try {
    const appointment = await appointments.getAppointmentById(req.params.id);
    res
      .status(200)
      .json({ data: appointment, message: "Appointment fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// @desc update an appointment
// @route PUT /api/v1/appointments/:id
// @access Public
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointments.updateAppointment(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ data: appointment, message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// @desc delete an appointment
// @route DELETE /api/v1/appointments/:id
// @access Public
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await appointments.deleteAppointment(req.params.id);
    res
      .status(200)
      .json({ data: appointment, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  getOneAppointment,
  updateAppointment,
  deleteAppointment,
};
