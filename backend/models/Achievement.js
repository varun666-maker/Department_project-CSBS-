const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    person: { type: String, required: true },
    type: { type: String, enum: ['student', 'faculty', 'placement'], required: true },
    date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
