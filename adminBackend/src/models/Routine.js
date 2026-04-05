const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema(
  {
    baby_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Baby',
      required: [true, 'Routine must belong to a baby'],
    },
    routine_type: {
      type: String,
      required: [true, 'Please specify routine type'],
      enum: [
        'feeding',
        'sleeping',
        'diaper_change',
        'playtime',
        'bath',
        'medicine',
        'other',
      ],
    },
    start_time: {
      type: Date,
      required: [true, 'Please provide start time'],
    },
    frequency: {
      type: String,
      required: [true, 'Please specify frequency'],
      enum: ['once', 'daily', 'weekly', 'custom'],
    },
  },
  { timestamps: true }
);

routineSchema.index({ baby_id: 1, routine_type: 1 });

module.exports = mongoose.model('Routine', routineSchema);
