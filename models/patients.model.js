const db = require("../config/db");

// @desc get all patients
// @route GET /api/v1/patients
// @access Public

const getAllPatients = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM patients ORDER BY name ASC");
    return rows;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

// @desc create a new patient
// @route POST /api/v1/patients
// @access Public

const createPatient = async (patient) => {
  try {
    const { name, age, medical_history, email, phone, address, kasallik } = patient;
    const contact_info = {
      email: email || "",
      phone: phone || "",
      address: address || "",
    };
    const { rows } = await db.query(
      "INSERT INTO patients (name, age, medical_history, contact_info, kasallik) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, age, medical_history, contact_info, kasallik || 'hech_narsa']
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

// @desc get a patient by id
// @route GET /api/v1/patients/:id
// @access Public

const getPatientById = async (id) => {
  try {
    const { rows } = await db.query("SELECT * FROM patients WHERE id = $1", [
      id,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

// @desc update a patient
// @route PUT /api/v1/patients/:id
// @access Public

const updatePatient = async (id, patient) => {
  try {
    const { name, age, medical_history, email, phone, address, kasallik } = patient;
    const oldPatient = await getPatientById(id);
    if (!oldPatient) {
      throw new Error("Patient not found");
    }

    // Create contact_info object with provided or existing values
    const contact_info = {
      email: email !== undefined ? email : oldPatient.contact_info?.email || "",
      phone: phone !== undefined ? phone : oldPatient.contact_info?.phone || "",
      address:
        address !== undefined
          ? address
          : oldPatient.contact_info?.address || "",
    };

    const updatedPatient = {
      name: name !== undefined ? name : oldPatient.name,
      age: age !== undefined ? age : oldPatient.age,
      medical_history:
        medical_history !== undefined
          ? medical_history
          : oldPatient.medical_history,
      contact_info: contact_info,
      kasallik: kasallik !== undefined ? kasallik : oldPatient.kasallik,
    };
    const { rows } = await db.query(
      "UPDATE patients SET name = $1, age = $2, medical_history = $3, contact_info = $4, kasallik = $5 WHERE id = $6 RETURNING *",
      [
        updatedPatient.name,
        updatedPatient.age,
        updatedPatient.medical_history,
        updatedPatient.contact_info,
        updatedPatient.kasallik,
        id,
      ]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

// @desc delete a patient
// @route DELETE /api/v1/patients/:id
// @access Public

const deletePatient = async (id) => {
  try {
    // Check if patient has appointments
    const { rows: appointments } = await db.query(
      "SELECT COUNT(*) as count FROM appointments WHERE patients_id = $1",
      [id]
    );
    
    if (parseInt(appointments[0].count) > 0) {
      throw new Error("Bu bemorda uchrashuvlar mavjud. Avval uchrashuvlarni o'chiring.");
    }

    const { rows } = await db.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};

// ==================== COMPLEX QUERIES ====================

// @desc Get all patients with appointments in date range
// @param startDate - start date (YYYY-MM-DD)
// @param endDate - end date (YYYY-MM-DD)
const getPatientsWithAppointmentsInDateRange = async (startDate, endDate) => {
  try {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.age, p.medical_history, p.contact_info::text as contact_info, p.kasallik,
              COUNT(a.id) as appointment_count
       FROM patients p
       INNER JOIN appointments a ON p.id = a.patients_id
       WHERE a.tayinlash_sanasi BETWEEN $1 AND $2
       GROUP BY p.id, p.name, p.age, p.medical_history, p.contact_info::text, p.kasallik
       ORDER BY p.name ASC`,
      [startDate, endDate]
    );
    // Parse contact_info back to object if it's a string
    return rows.map(row => ({
      ...row,
      contact_info: typeof row.contact_info === 'string' ? JSON.parse(row.contact_info) : row.contact_info
    }));
  } catch (error) {
    console.error("Error fetching patients with appointments:", error);
    throw error;
  }
};

// @desc Get all patients with specific kasallik
// @param kasallikType - kasallik type
const getPatientsByKasallik = async (kasallikType) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM patients WHERE kasallik = $1 ORDER BY name ASC",
      [kasallikType]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching patients by kasallik:", error);
    throw error;
  }
};

// @desc Get all appointments for specific doctor
// @param doctorName - doctor name
const getAppointmentsByDoctor = async (doctorName) => {
  try {
    const { rows } = await db.query(
      `SELECT a.*, p.name as patient_name, p.kasallik 
       FROM appointments a
       LEFT JOIN patients p ON a.patients_id = p.id
       WHERE a.doctor_name = $1
       ORDER BY a.tayinlash_sanasi DESC`,
      [doctorName]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching appointments by doctor:", error);
    throw error;
  }
};

// @desc Get patients without appointments in date range
// @param startDate - start date (YYYY-MM-DD)
// @param endDate - end date (YYYY-MM-DD)
const getPatientsWithoutAppointmentsInRange = async (startDate, endDate) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*
       FROM patients p
       WHERE NOT EXISTS (
         SELECT 1 
         FROM appointments a 
         WHERE a.patients_id = p.id 
           AND a.tayinlash_sanasi BETWEEN $1 AND $2
       )
       ORDER BY p.name ASC`,
      [startDate, endDate]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching patients without appointments:", error);
    throw error;
  }
};

// @desc Get patients with appointments scheduled between two dates
// @param startDate - start date
// @param endDate - end date
const getPatientsWithScheduledAppointments = async (startDate, endDate) => {
  try {
    const { rows } = await db.query(
      `SELECT p.id, p.name, p.age, p.medical_history, p.contact_info::text as contact_info, p.kasallik,
              a.tayinlash_sanasi as appointment_date,
              a.doctor_name,
              a.status as appointment_status
       FROM patients p
       INNER JOIN appointments a ON p.id = a.patients_id
       WHERE a.tayinlash_sanasi BETWEEN $1 AND $2
         AND a.status = 'rejalashtirilgan'
       ORDER BY a.tayinlash_sanasi ASC`,
      [startDate, endDate]
    );
    // Parse contact_info back to object if it's a string
    return rows.map(row => ({
      ...row,
      contact_info: typeof row.contact_info === 'string' ? JSON.parse(row.contact_info) : row.contact_info
    }));
  } catch (error) {
    console.error("Error fetching patients with scheduled appointments:", error);
    throw error;
  }
};

// @desc Get patients by kasallik mentioned in medical_history
// @param kasallikKeyword - keyword to search in medical_history
const getPatientsByMedicalHistory = async (kasallikKeyword) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM patients 
       WHERE medical_history ILIKE $1
       ORDER BY name ASC`,
      [`%${kasallikKeyword}%`]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching patients by medical history:", error);
    throw error;
  }
};

// @desc Get patients without appointments in last N months
// @param months - number of months (default 6)
const getPatientsWithoutRecentAppointments = async (months = 6) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*
       FROM patients p
       WHERE NOT EXISTS (
         SELECT 1 
         FROM appointments a 
         WHERE a.patients_id = p.id 
           AND a.tayinlash_sanasi >= CURRENT_DATE - INTERVAL '${months} months'
       )
       ORDER BY p.name ASC`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching patients without recent appointments:", error);
    throw error;
  }
};

module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  // Complex queries
  getPatientsWithAppointmentsInDateRange,
  getPatientsByKasallik,
  getAppointmentsByDoctor,
  getPatientsWithoutAppointmentsInRange,
  getPatientsWithScheduledAppointments,
  getPatientsByMedicalHistory,
  getPatientsWithoutRecentAppointments,
};
