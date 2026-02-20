const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

// GET /api/notices — public
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1, createdAt: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/notices/:id — public
router.get('/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ error: 'Notice not found' });
        res.json(notice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/notices — admin only
router.post('/', auth, async (req, res) => {
    try {
        const notice = new Notice(req.body);
        await notice.save();
        res.status(201).json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/notices/:id — admin only
router.put('/:id', auth, async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!notice) return res.status(404).json({ error: 'Notice not found' });
        res.json(notice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/notices/:id — admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) return res.status(404).json({ error: 'Notice not found' });
        res.json({ message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
