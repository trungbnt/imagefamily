const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Khác'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema); 