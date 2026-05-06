require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schoolRoutes = require('./routes/school.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the School Management API' });
});

// Use Routes
app.use('/api', schoolRoutes);

// Starting the server (only locally, Vercel handles it otherwise)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
