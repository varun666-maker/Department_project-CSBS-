const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
    label: String,
    type: { type: String, enum: ['text', 'select', 'textarea'], default: 'text' },
    required: { type: Boolean, default: false },
    options: String
}, { _id: false });

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: String, required: true },
    category: { type: String, enum: ['general', 'cultural', 'technical', 'hackathon', 'workshop'], default: 'general' },
    requiresRegistration: { type: Boolean, default: false },
    entranceFee: { type: Number, default: 0 },
    qrCodeUrl: { type: String, default: '' },
    formFields: [formFieldSchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
