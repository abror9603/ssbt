const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  getOneAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointments.controller");

router.get("/", getAllAppointments);
router.post("/", createAppointment);
router.get("/:id", getOneAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
