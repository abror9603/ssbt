const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/db');

// Handlebars setup with helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        // Format date for display
        formatDate: function(date) {
            if (!date) return '-';
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        },
        // Format date for datetime-local input
        formatDateTime: function(date) {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        },
        // Get status badge class
        getStatusClass: function(status) {
            if (!status) return '';
            const statusMap = {
                'rejalashtirilgan': 'rejalashtirilgan',
                'tugallangan': 'tugallangan',
                'bekor qilingan': 'bekor-qilingan'
            };
            return statusMap[status] || '';
        },
        // Equality helper
        eq: function(a, b) {
            return a === b;
        },
        // Current year helper
        currentYear: function() {
            return new Date().getFullYear();
        },
        // Default value helper (for || operator)
        default: function(value, defaultValue) {
            return value || defaultValue;
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes
app.use('/api/v1/patients', require('./routes/patients.route'))
app.use('/api/v1/appointments', require('./routes/appointments.route'))

// Frontend routes
app.use('/patients', require('./routes/views/patients.view.route'))
app.use('/appointments', require('./routes/views/appointments.view.route'))

// Home route
app.get('/', (req, res) => {
    res.redirect('/patients');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})