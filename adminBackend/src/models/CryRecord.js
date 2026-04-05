const mongoose = require('mongoose');

const cryRecordSchema = new mongoose.Schema(
  {
    baby_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Baby',
      required: [true, 'Cry record must belong to a baby'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    audio_file_path: {
      type: String,
      required: [true, 'Please provide audio file path'],
    },
    confidence_score: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, 'Please provide confidence score'],
    },
    classification_result: {
      type: String,
      required: [true, 'Please provide classification result'],
      enum: [
        'hungry',
        'tired',
        'pain',
        'discomfort',
        'attention',
        'unknown',
      ],
    },
  },
  { timestamps: true }
);

cryRecordSchema.index({ baby_id: 1, timestamp: -1 });

module.exports = mongoose.model('CryRecord', cryRecordSchema);
