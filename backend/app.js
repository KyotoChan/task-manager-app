const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route files correctly
const notificationsRoutes = require('./routes/Notifications');
const preferencesRoutes = require('./routes/Preferences');
const userRoutes = require('./routes/Users'); 

const app = express();
app.use(cors({ origin: "*" })); // CORS - Allow all origins (You may restrict it in production)

// Middleware
app.use(bodyParser.json());

// Correct route paths (remove `/routes/`)
app.use('/notifications', notificationsRoutes); // Notifications-related routes
app.use('/preferences', preferencesRoutes); // Notification preferences routes
app.use('/users', userRoutes); // User authentication routes

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Notification System API');
});

module.exports = app;