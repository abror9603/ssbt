// Form Validation and Utility Functions

document.addEventListener('DOMContentLoaded', function() {
    // Patient Form Validation
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', function(e) {
            if (!validatePatientForm()) {
                e.preventDefault();
            }
        });
    }

    // Appointment Form Validation
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            if (!validateAppointmentForm()) {
                e.preventDefault();
            }
        });
    }

    // Real-time validation
    setupRealTimeValidation();
});

function validatePatientForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showError(name, 'Ism kiritilishi shart');
        isValid = false;
    } else {
        clearError(name);
    }

    // Age validation
    const age = document.getElementById('age');
    if (!age.value || age.value < 1 || age.value > 150) {
        showError(age, 'Yosh 1 dan 150 gacha bo\'lishi kerak');
        isValid = false;
    } else {
        clearError(age);
    }

    // Phone validation
    const phone = document.getElementById('phone');
    const phoneRegex = /^[+]?[0-9]{9,15}$/;
    if (!phone.value.trim()) {
        showError(phone, 'Telefon raqami kiritilishi shart');
        isValid = false;
    } else if (!phoneRegex.test(phone.value)) {
        showError(phone, 'Telefon raqami noto\'g\'ri formatda');
        isValid = false;
    } else {
        clearError(phone);
    }

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email kiritilishi shart');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Email noto\'g\'ri formatda');
        isValid = false;
    } else {
        clearError(email);
    }

    return isValid;
}

function validateAppointmentForm() {
    let isValid = true;
    
    // Patient validation
    const patientsId = document.getElementById('patients_id');
    if (patientsId && !patientsId.value) {
        showError(patientsId, 'Bemor tanlash shart');
        isValid = false;
    } else if (patientsId) {
        clearError(patientsId);
    }

    // Doctor name validation
    const doctorName = document.getElementById('doctor_name');
    if (!doctorName.value.trim()) {
        showError(doctorName, 'Shifokor ismi kiritilishi shart');
        isValid = false;
    } else {
        clearError(doctorName);
    }

    // Date validation
    const date = document.getElementById('tayinlash_sanasi');
    if (!date.value) {
        showError(date, 'Sana kiritilishi shart');
        isValid = false;
    } else {
        const selectedDate = new Date(date.value);
        const now = new Date();
        // Allow past dates for appointments that might be scheduled
        clearError(date);
    }

    // Status validation
    const status = document.getElementById('status');
    if (!status.value) {
        showError(status, 'Status tanlanishi shart');
        isValid = false;
    } else {
        clearError(status);
    }

    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function setupRealTimeValidation() {
    // Patient form real-time validation
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        const inputs = patientForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    if (!this.value.trim()) {
                        showError(this, 'Bu maydon to\'ldirilishi shart');
                    } else {
                        clearError(this);
                    }
                }
            });
        });

        // Email format check
        const email = document.getElementById('email');
        if (email) {
            email.addEventListener('blur', function() {
                if (this.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        showError(this, 'Email noto\'g\'ri formatda');
                    } else {
                        clearError(this);
                    }
                }
            });
        }

        // Phone format check
        const phone = document.getElementById('phone');
        if (phone) {
            phone.addEventListener('blur', function() {
                if (this.value.trim()) {
                    const phoneRegex = /^[+]?[0-9]{9,15}$/;
                    if (!phoneRegex.test(this.value)) {
                        showError(this, 'Telefon raqami noto\'g\'ri formatda');
                    } else {
                        clearError(this);
                    }
                }
            });
        }
    }

    // Appointment form real-time validation
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const inputs = appointmentForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    if (!this.value.trim()) {
                        showError(this, 'Bu maydon to\'ldirilishi shart');
                    } else {
                        clearError(this);
                    }
                }
            });
        });
    }
}

