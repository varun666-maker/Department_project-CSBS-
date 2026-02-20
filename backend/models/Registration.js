const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    fullName: { type: String, required: true },
    usn: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
