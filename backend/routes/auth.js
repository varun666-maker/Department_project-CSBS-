const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded admin credentials (same as original frontend)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, message: 'Login successful' });
    }
    return res.status(401).json({ error: 'Invalid username or password.' });
});

module.exports = router;
