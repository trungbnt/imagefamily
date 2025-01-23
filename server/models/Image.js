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
    required: true,
    default: 'Khác'
  },
  order: {
    type: Number,
    default: 0
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
  timestamps: true,
  collection: 'images'
});

module.exports = mongoose.model('Image', imageSchema); 