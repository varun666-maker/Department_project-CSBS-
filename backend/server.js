require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow frontend origins
// ⚠️ AFTER deploying frontend, replace YOUR-FRONTEND-NAME below with your actual Netlify/Vercel URL
app.use(cors({
    origin: [
        'https://YOUR-FRONTEND-NAME.netlify.app',   // Netlify
        // 'https://YOUR-FRONTEND-NAME.vercel.app', // OR Vercel — uncomment if using Vercel
        'http://localhost:5000'                      // Local dev
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/events', require('./routes/events'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/students', require('./routes/students'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/registrations', require('./routes/registrations'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas (csbs_db)');
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            console.log(`📁 Serving frontend from ${path.join(__dirname, '..')}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
