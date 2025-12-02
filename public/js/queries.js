// Queries page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle all query forms
    const forms = document.querySelectorAll('.query-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const action = form.getAttribute('action');
            const url = buildQueryURL(action, formData);
            
            try {
                showLoading();
                const response = await fetch(url);
                const result = await response.json();
                
                if (response.ok) {
                    displayResults(result);
                } else {
                    showError(result.message || 'Xatolik yuz berdi');
                }
            } catch (error) {
                showError('Xatolik: ' + error.message);
            } finally {
                hideLoading();
            }
        });
    });
});

function buildQueryURL(action, formData) {
    const params = new URLSearchParams();
    
    // Handle different query types
    if (action.includes('by-kasallik')) {
        const kasallik = formData.get('kasallik');
        return `${action}/${kasallik}`;
    } else if (action.includes('by-doctor')) {
        const doctorName = formData.get('doctorName');
        return `${action}/${encodeURIComponent(doctorName)}`;
    } else {
        // Regular query parameters
        for (const [key, value] of formData.entries()) {
            if (value) {
                params.append(key, value);
            }
        }
        return `${action}?${params.toString()}`;
    }
}

function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    if (!result.data || result.data.length === 0) {
        resultsContent.innerHTML = `
            <div class="alert alert-info">
                <p>Natijalar topilmadi</p>
            </div>
        `;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Determine if it's patients or appointments
    const isPatient = result.data[0].hasOwnProperty('name') && result.data[0].hasOwnProperty('age');
    const isAppointment = result.data[0].hasOwnProperty('doctor_name') && result.data[0].hasOwnProperty('tayinlash_sanasi');
    
    let html = '';
    
    if (isPatient) {
        html = renderPatientsTable(result.data);
    } else if (isAppointment) {
        html = renderAppointmentsTable(result.data);
    } else {
        html = renderGenericTable(result.data);
    }
    
    resultsContent.innerHTML = html;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function renderPatientsTable(patients) {
    let html = `
        <div class="results-info">
            <p><strong>Topilgan bemorlar soni:</strong> ${patients.length}</p>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ism</th>
                        <th>Yosh</th>
                        <th>Kasallik</th>
                        <th>Telefon</th>
                        <th>Email</th>
                        <th>Manzil</th>
                        <th>Tibbiy tarix</th>
                        ${patients[0].appointment_count ? '<th>Uchrashuvlar soni</th>' : ''}
                        ${patients[0].appointment_date ? '<th>Uchrashuv sanasi</th><th>Shifokor</th><th>Status</th>' : ''}
                    </tr>
                </thead>
                <tbody>
    `;
    
    patients.forEach(patient => {
        const contactInfo = patient.contact_info || {};
        const kasallikNames = {
            'diabet': 'Diabet',
            'gipertenziya': 'Gipertenziya',
            'astma': 'Astma',
            'yurak_kasalligi': 'Yurak kasalligi',
            'hech_narsa': 'Hech narsa'
        };
        
        html += `
            <tr>
                <td class="table-id">${patient.id.substring(0, 8)}...</td>
                <td class="table-name">${escapeHtml(patient.name)}</td>
                <td>${patient.age}</td>
                <td>
                    <span class="badge badge-kasallik">
                        ${kasallikNames[patient.kasallik] || patient.kasallik}
                    </span>
                </td>
                <td>${escapeHtml(contactInfo.phone || '-')}</td>
                <td>${escapeHtml(contactInfo.email || '-')}</td>
                <td>${escapeHtml(contactInfo.address || '-')}</td>
                <td>${escapeHtml(patient.medical_history || '-')}</td>
                ${patient.appointment_count ? `<td>${patient.appointment_count}</td>` : ''}
                ${patient.appointment_date ? `
                    <td>${formatDate(patient.appointment_date)}</td>
                    <td>${escapeHtml(patient.doctor_name || '-')}</td>
                    <td>
                        <span class="badge badge-${getStatusClass(patient.appointment_status)}">
                            ${patient.appointment_status || '-'}
                        </span>
                    </td>
                ` : ''}
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function renderAppointmentsTable(appointments) {
    let html = `
        <div class="results-info">
            <p><strong>Topilgan uchrashuvlar soni:</strong> ${appointments.length}</p>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Bemor</th>
                        <th>Shifokor ismi</th>
                        <th>Sana</th>
                        <th>Status</th>
                        <th>Kasallik</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    appointments.forEach(appointment => {
        const kasallikNames = {
            'diabet': 'Diabet',
            'gipertenziya': 'Gipertenziya',
            'astma': 'Astma',
            'yurak_kasalligi': 'Yurak kasalligi',
            'hech_narsa': 'Hech narsa'
        };
        
        html += `
            <tr>
                <td class="table-name">${escapeHtml(appointment.patient_name || '-')}</td>
                <td>${escapeHtml(appointment.doctor_name)}</td>
                <td>${formatDate(appointment.tayinlash_sanasi)}</td>
                <td>
                    <span class="badge badge-${getStatusClass(appointment.status)}">
                        ${appointment.status}
                    </span>
                </td>
                <td>
                    <span class="badge badge-kasallik">
                        ${kasallikNames[appointment.kasallik] || appointment.kasallik || '-'}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function renderGenericTable(data) {
    let html = `
        <div class="results-info">
            <p><strong>Natijalar soni:</strong> ${data.length}</p>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        ${Object.keys(data[0]).map(key => `<th>${escapeHtml(key)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(item => {
        html += '<tr>';
        Object.values(item).forEach(value => {
            html += `<td>${escapeHtml(String(value || '-'))}</td>`;
        });
        html += '</tr>';
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function getStatusClass(status) {
    if (!status) return '';
    const statusMap = {
        'rejalashtirilgan': 'rejalashtirilgan',
        'tugallangan': 'tugallangan',
        'bekor qilingan': 'bekor-qilingan'
    };
    return statusMap[status] || '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

function showLoading() {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '<div class="loading">Yuklanmoqda...</div>';
    resultsSection.style.display = 'block';
}

function hideLoading() {
    // Loading is handled by displayResults
}

function showError(message) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = `
        <div class="alert alert-error">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

