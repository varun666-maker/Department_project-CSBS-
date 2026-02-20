const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

// GET /api/achievements — public
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ date: -1 });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/achievements/:id — public
router.get('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
        res.json(achievement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/achievements — admin only
router.post('/', auth, async (req, res) => {
    try {
        const achievement = new Achievement(req.body);
        await achievement.save();
        res.status(201).json(achievement);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/achievements/:id — admin only
router.put('/:id', auth, async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
        res.json(achievement);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/achievements/:id — admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
        res.json({ message: 'Achievement deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
