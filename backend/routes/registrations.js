const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// GET /api/registrations — optionally filter by eventId
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.eventId) filter.eventId = req.query.eventId;
        const registrations = await Registration.find(filter).sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/registrations — public (anyone can register for events)
router.post('/', async (req, res) => {
    try {
        const registration = new Registration(req.body);
        await registration.save();
        res.status(201).json(registration);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/registrations/:id — admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) return res.status(404).json({ error: 'Registration not found' });
        res.json({ message: 'Registration deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
