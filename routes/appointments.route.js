const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  getOneAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctor,
} = require("../controllers/appointments.controller");

// Basic CRUD routes
router.get("/", getAllAppointments);
router.post("/", createAppointment);

// Complex query routes (must be before /:id route)
router.get("/queries/by-doctor/:doctorName", getAppointmentsByDoctor);

router.get("/:id", getOneAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
