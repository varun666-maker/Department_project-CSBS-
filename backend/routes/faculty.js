const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');

// GET /api/faculty — public
router.get('/', async (req, res) => {
    try {
        const faculty = await Faculty.find().sort({ createdAt: 1 });
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/faculty/:id — public
router.get('/:id', async (req, res) => {
    try {
        const member = await Faculty.findById(req.params.id);
        if (!member) return res.status(404).json({ error: 'Faculty not found' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/faculty — admin only
router.post('/', auth, async (req, res) => {
    try {
        const member = new Faculty(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/faculty/:id — admin only
router.put('/:id', auth, async (req, res) => {
    try {
        const member = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!member) return res.status(404).json({ error: 'Faculty not found' });
        res.json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/faculty/:id — admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const member = await Faculty.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ error: 'Faculty not found' });
        res.json({ message: 'Faculty deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
