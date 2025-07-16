const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'cancelled', 'failed'],
    default: 'scheduled'
  },
  sentAt: {
    type: Date
  },
  error: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema); 