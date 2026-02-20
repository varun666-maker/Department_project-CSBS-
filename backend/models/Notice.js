const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, enum: ['urgent', 'new', 'general'], default: 'general' },
  author: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
