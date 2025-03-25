const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: String,
  provider: {
    type: String,
    required: true,
    enum: ['google', 'facebook', 'local']
  },
  providerId: String,
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 