const db = require("../config/db");

// @desc get all patients
// @route GET /api/v1/patients
// @access Public

const getAllPatients = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM patients");
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
    const { name, age, medical_history, email, phone, address } = patient;
    const contact_info = {
      email: email || "",
      phone: phone || "",
      address: address || "",
    };
    const { rows } = await db.query(
      "INSERT INTO patients (name, age, medical_history, contact_info) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, medical_history, contact_info]
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
    const { name, age, medical_history, email, phone, address } = patient;
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
    };
    const { rows } = await db.query(
      "UPDATE patients SET name = $1, age = $2, medical_history = $3, contact_info = $4 WHERE id = $5 RETURNING *",
      [
        updatedPatient.name,
        updatedPatient.age,
        updatedPatient.medical_history,
        updatedPatient.contact_info,
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

module.exports = {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
