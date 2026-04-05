 // ============================================
// adminBackend/src/models/Tutorial.js
// ============================================
const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide tutorial title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true
  },
  video_link: {
    type: String,
    required: [true, 'Please provide video link'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

tutorialSchema.index({ category: 1 });

module.exports = mongoose.model('Tutorial', tutorialSchema);
