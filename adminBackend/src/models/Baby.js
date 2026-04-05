
// ============================================
// adminBackend/src/models/Baby.js
// ============================================
const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Baby must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Please provide baby name'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please specify gender']
  }
}, {
  timestamps: true
});

babySchema.index({ user_id: 1 });

module.exports = mongoose.model('Baby', babySchema);


