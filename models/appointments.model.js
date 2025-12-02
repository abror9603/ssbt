const db = require("../config/db");

// @desc get all appointments
// @route GET /api/v1/appointments
// @access Public

const getAllAppointments = async () => {
  try {
    const { rows } = await db.query(
      `SELECT a.*, p.name as patient_name 
       FROM appointments a 
       LEFT JOIN patients p ON a.patients_id = p.id 
       ORDER BY a.tayinlash_sanasi DESC`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// @desc create a new appointment
// @route POST /api/v1/appointments
// @access Public

const createAppointment = async (appointment) => {
  try {
    const { doctor_name, tayinlash_sanasi, status, patients_id } = appointment;
    const { rows } = await db.query(
      "INSERT INTO appointments (doctor_name, tayinlash_sanasi, status, patients_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [doctor_name, tayinlash_sanasi, status || "rejalashtirilgan", patients_id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// @desc get an appointment by id
// @route GET /api/v1/appointments/:id
// @access Public

const getAppointmentById = async (id) => {
  try {
    const { rows } = await db.query(
      `SELECT a.*, p.name as patient_name 
       FROM appointments a 
       LEFT JOIN patients p ON a.patients_id = p.id 
       WHERE a.id = $1`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// @desc update an appointment
// @route PUT /api/v1/appointments/:id
// @access Public

const updateAppointment = async (id, appointment) => {
  try {
    const { doctor_name, tayinlash_sanasi, status, patients_id } = appointment;
    const oldAppointment = await getAppointmentById(id);
    if (!oldAppointment) {
      throw new Error("Appointment not found");
    }
    const updatedAppointment = {
      doctor_name: doctor_name || oldAppointment.doctor_name,
      tayinlash_sanasi: tayinlash_sanasi || oldAppointment.tayinlash_sanasi,
      status: status || oldAppointment.status,
      patients_id:
        patients_id !== undefined ? patients_id : oldAppointment.patients_id,
    };
    const { rows } = await db.query(
      "UPDATE appointments SET doctor_name = $1, tayinlash_sanasi = $2, status = $3, patients_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [
        updatedAppointment.doctor_name,
        updatedAppointment.tayinlash_sanasi,
        updatedAppointment.status,
        updatedAppointment.patients_id,
        id,
      ]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// @desc delete an appointment
// @route DELETE /api/v1/appointments/:id
// @access Public

const deleteAppointment = async (id) => {
  try {
    const { rows } = await db.query(
      "DELETE FROM appointments WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
